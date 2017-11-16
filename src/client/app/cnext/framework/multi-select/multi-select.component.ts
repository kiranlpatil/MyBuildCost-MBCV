import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from "@angular/core";
import {MultiSelectService} from "./multi-select.service";
import {Messages} from "../../../shared/constants";
import {ErrorService} from "../../../shared/services/error.service";


@Component({
  moduleId: module.id,
  selector: 'cn-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: ['multi-select.component.css']
})

export class MultiSelectComponent implements OnChanges, OnInit {
  @Input() selectedData: string[];
  @Input() maxLength: number;
  @Input() type: string;
  @Input() data: string[];
  @Output() onComplete = new EventEmitter();
  @Input() submitStatus: boolean;
  @Input() requiredKeySkillsValidationMessage: string;
  @Input() maxKeySkillsValidationMessage: string;

  selectedProficiencies: string[] = [];
  private masterDataProficiencies: string[] = [];
  proficiencies: string[] = [];
  private validationMessage: string;
  showAlert: boolean = false;
  private showModalStyle: boolean = false;
  private newProficiency: string = '';
  proficiency: string = '';
  proficienciesPlaceholder: string = '';
  private disableTextField: boolean = false;
  private isInfoMessage: boolean = false;

  @ViewChild('myInput')
  private _inputElement: ElementRef;

  constructor(private proficiencydoaminService: MultiSelectService,
              private errorService: ErrorService) {
  }

  ngOnInit() {
    if (window.innerWidth < 1024) {
      this.proficienciesPlaceholder = Messages.KEYSKILLS_PLACEHOLDER_MOBILE;
    } else {
      this.proficienciesPlaceholder = Messages.KEYSKILLS_PLACEHOLDER_DESKTOP;
    }
  }

  ngOnChanges(changes: any) {
    if (this.data !== undefined) {
      if (this.data.length > 0) {
        this.proficiencies = this.data;
        for (let item of this.proficiencies) {
          if (item.length === 1) {
            this.proficiencies.splice(this.proficiencies.indexOf(item), 1);
          }
        }
        let i: any;
        this.masterDataProficiencies = this.data;
      }
    }
    if (this.selectedData !== undefined) {
      if (this.selectedData.length > 0) {
        this.selectedProficiencies = this.selectedData;
        for (let pro of this.selectedData) {
          this.deleteSelectedProficiency(pro);
        }
      }
    }

  }

  addProficiency(event: any) {
    console.log("inside AddProficiency");
    this.proficiency = event.target.value;
    if (this.validateProficiency(this.proficiency)) {
      let tempMasterDataProficiencies: any = this.masterDataProficiencies;
      tempMasterDataProficiencies = tempMasterDataProficiencies.map((i:any)  => i.toLowerCase());
      if (tempMasterDataProficiencies.indexOf(this.proficiency.toLowerCase()) == -1) {
        this.newProficiency = this.proficiency;
        this.addProficiencyToMasterData();
      }else {
        let tempProficiencyIndex = tempMasterDataProficiencies.indexOf(this.proficiency.toLowerCase());
        this.selectedProficiencyModel(this.masterDataProficiencies[tempProficiencyIndex]);
      }
    }
  }

  proficiencyChanged(proficiency: string) {
    if (this.validateProficiency(proficiency)) {
      if (this.masterDataProficiencies.indexOf(proficiency) == -1) {
        this.newProficiency = proficiency;
      }
    }
  }

  validateProficiency(newVal: string) {
    console.log("inside validateProficiency");
    this.newProficiency = '';

    if (newVal == '' || newVal.trim().length < 1) {
      return false;
    }

    newVal = newVal.toLowerCase();
    let tempArrayOfSelectedProficiencies = this.selectedProficiencies.slice();
    tempArrayOfSelectedProficiencies = tempArrayOfSelectedProficiencies.map((m: any) => m.toLowerCase());
    if (tempArrayOfSelectedProficiencies.indexOf(newVal) != -1) {
      return false;
    }

    return true;
  }

  /*selectFirstProficiency(newVal: string) {
   console.log("inside selectedFirstProficiency");
   let i: number = 0;
   let selectItems: any = {};
   let proficiencies: any = document.getElementById("Proficiencies");
   let optionsArray: any = proficiencies.getElementsByTagName('option');
   let valueArray: string[] = new Array();

   for (let opt of optionsArray) {
   valueArray.push(opt.value);
   }

   valueArray = valueArray.sort();
   for (let value of valueArray) {
   let listValue: any = value;
   selectItems[i] = listValue + ",";
   i++;
   }

   let count: number = i;
   let blockOfText: string = '';
   for (i = 0; i < count; i++) {
   blockOfText = blockOfText + " " + selectItems[i].toLowerCase() + ",";
   }

   let textToSplit: any = blockOfText.split(",");

   for (let j = 0; j < textToSplit.length; j++) {
   if (textToSplit[j].indexOf(newVal) != -1) {
   return textToSplit[j];
   }
   }
   }*/

  selectedProficiencyModel(proficiency: string) {
    console.log("inside selectedProficiencyModel");

    this.validationMessage = '';
    let countArray = [4, 3, 2, 1];
    this.submitStatus = false;
    this.disableTextField = false;
    this.selectedProficiencies.push(proficiency);
    this.onComplete.emit(this.selectedProficiencies);
    if (countArray.indexOf(this.selectedProficiencies.length) > -1) {
      this.isInfoMessage = true;
      this.validationMessage = `You can add ${this.maxLength - this.selectedProficiencies.length} more key skills.`;
      this.showAlert = true;
    }
    if (this.selectedProficiencies.length === this.maxLength) {
      this.isInfoMessage = true;
      this.validationMessage = this.maxKeySkillsValidationMessage;
      this.showAlert = true;
    }
    let emptyInputField: any = document.getElementById(this.type);
    emptyInputField.value = '';
    this.newProficiency = '';
    this.deleteSelectedProficiency(proficiency);
  }

  deleteItem(newVal: any) {
    let setOfCapabilityNumber = [4, 3, 2, 1];
    this.showAlert = false;
    this.isInfoMessage = false;
    for (let i = 0; i < this.selectedProficiencies.length; i++) {
      if (this.selectedProficiencies[i].trim() === newVal.currentTarget.id.trim()) {
        this.selectedProficiencies.splice(i, 1);
        if (newVal.currentTarget.id.trim().length > 1) {
          this.proficiencies.push(newVal.currentTarget.id.trim());
        }
      }
    }
    if (setOfCapabilityNumber.indexOf(this.selectedProficiencies.length) > 0) {
      this.disableTextField = false;
      this.isInfoMessage = true;
      this.validationMessage = `You can add ${this.maxLength - this.selectedProficiencies.length} more key skills.`;
      this.showAlert = true;
    }
    this.onComplete.emit(this.selectedProficiencies);
  }

  deleteSelectedProficiency(newVal: any) {
    for (let i = 0; i < this.proficiencies.length; i++) {
      if (this.proficiencies[i].toUpperCase().trim() === newVal.toUpperCase().trim()) {
        this.proficiencies.splice(i, 1);
        break;
      }
    }
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
    console.log("inside addProficiencyToMasterData");
    this.proficiencydoaminService.addProficiencyToMasterData(this.newProficiency).subscribe(
      data => {
        this.masterDataProficiencies.push(this.newProficiency);
        this.selectedProficiencyModel(this.newProficiency);
        this.newProficiency = '';
      }, error => this.errorService.onError(error));
  }
}
