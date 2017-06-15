import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MultiSelectService } from './multi-select.service';

@Component({
  moduleId: module.id,
  selector: 'cn-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: ['multi-select.component.css']
})

export class MultiSelectComponent {
  @Input() selectedData: string[];
  @Input() maxLength: number;
  @Input() type: string;
  @Input() data: string[];
  @Output() onComplete = new EventEmitter();

  private selectedProficiencies = new Array();
  private masterDataProficiencies = new Array();
  private Proficiencies = new Array();
  private showAlert: boolean = false;
  private alreadyPresent: boolean = false;
  private showModalStyle: boolean = false;
  private otherProficiency: string = '';
  @ViewChild("myInput")
  private _inputElement: ElementRef;

  constructor(private proficiencydoaminService: MultiSelectService) {

  }

  /* ngOnInit() {
   debugger
   document.getElementById('save-button').focus();

   }
   */
  ngOnChanges(changes: any) {
    if (this.data != undefined) {
      if (this.data.length > 0) {
        this.Proficiencies = this.data;
        this.masterDataProficiencies = this.data;
      }
    }
    if (this.selectedData != undefined) {
      if (this.selectedData.length > 0) {
        this.selectedProficiencies = this.selectedData;
        for (let proficiency of this.selectedData) {
          this.deleteSelectedProfeciency(proficiency);
        }
      }
    }
  }

  selectedProficiencyModel(newVal: any) {
    if (newVal !== '') {
      if (this.selectedProficiencies.length < this.maxLength) {
        if (this.selectedProficiencies.indexOf(newVal) === -1) {
          this.selectedProficiencies.push(newVal);
          this.deleteSelectedProfeciency(newVal);
          this.onComplete.emit(this.selectedProficiencies);
        }
      } else {
        this.showAlert = true;
      }
    }

    let emptyInputField: any = document.getElementById(this.type);
    emptyInputField.value = '';
  }

  deleteItem(newVal: any) {
    this.showAlert = false;
    for (let i = 0; i < this.selectedProficiencies.length; i++) {
      if (this.selectedProficiencies[i] === newVal.currentTarget.innerText.trim()) {
        this.selectedProficiencies.splice(i, 1);
        this.Proficiencies.push(newVal.currentTarget.innerText.trim());
      }
    }
    this.onComplete.emit(this.selectedProficiencies);
  }

  deleteSelectedProfeciency(newVal: any) {
    if (this.Proficiencies.indexOf(newVal) != -1) {
      this.Proficiencies.splice(this.Proficiencies.indexOf(newVal), 1);
    }
  }

  showHideModal(newVal: any) { //TODO
    this.otherProficiency = newVal;

    if (newVal !== '' && this.masterDataProficiencies.indexOf(newVal) === -1)
      this.showModalStyle = !this.showModalStyle;
  }

  getStyleModal() {
    if (this.showModalStyle) {
      this._inputElement.nativeElement.focus();
      return 'block';
    } else {
      return 'none';
    }
  }

  addProficiencyToMasterData() {
    this.showModalStyle = !this.showModalStyle;
    if (this.otherProficiency !== '') {
      for (let i = 0; i < this.masterDataProficiencies.length; i++) {
        if (this.masterDataProficiencies[i] === this.otherProficiency) {
          this.alreadyPresent = true;
        }
      }
      if (this.alreadyPresent === false) {
        this.proficiencydoaminService.addProficiencyToMasterData(this.otherProficiency).subscribe(
          data => {
            console.log(data);
          });
        this.selectedProficiencyModel(this.otherProficiency);
      }
    }
    this.alreadyPresent = false;
    let emptyInputField: any = document.getElementById(this.type);
    emptyInputField.value = '';
  }
}
