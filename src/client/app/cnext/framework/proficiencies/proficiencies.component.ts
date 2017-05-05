import {Component, Input, EventEmitter, Output} from "@angular/core";
import {ValueConstant} from "../../../framework/shared/constants";
import { Section} from "../model/candidate";
import {Proficiences} from "../model/proficiency";
import {ProficiencyDomainService} from "./proficiencies.service";
import {MessageService} from "../../../framework/shared/message.service";
import {Message} from "../../../framework/shared/message";

@Component({
  moduleId: module.id,
  selector: 'cn-proficiencies',
  templateUrl: 'proficiencies.component.html',
  styleUrls: ['proficiencies.component.css']
})

export class ProficienciesComponent {
  @Input() choosedproficiencies:string[];
  @Input() highlightedSection :Section;
  @Input() proficiencies:Proficiences = new Proficiences();
  @Output() onComplete = new EventEmitter();


  private selectedProficiencies = new Array();
  private masterDataProficiencies = new Array();
  private Proficiencies = new Array();
  private showAlert:boolean = false;
  private disablebutton:boolean = true;
  private alreadyPresent:boolean = false;
  private showModalStyle:boolean = false;
  private otherProficiency:string = '';


  constructor(private proficiencydoaminService:ProficiencyDomainService ,private messageService:MessageService ) {
  }
  ngOnInit() {
    this.proficiencydoaminService.getProficiency()
      .subscribe(
        data => this.OnProficiencyDataSuccess(data),
        error => this.onError(error));
  }

  ngOnChanges (changes:any) {
   /* if (changes.proficiencies != undefined) {
      if (changes.proficiencies.currentValue != undefined) {
        this.proficiencies = changes.proficiencies.currentValue;*/
    if(this.choosedproficiencies != undefined){
    if (this.choosedproficiencies.length > 0) {
          this.selectedProficiencies = this.choosedproficiencies;
          for (let proficiency of this.choosedproficiencies) {
            this.deleteSelectedProfeciency(proficiency);
          }
          this.disablebutton=false;
        }
      }
  }
    /*}*/
  /*}*/
  OnProficiencyDataSuccess(data:any) {
this.Proficiencies= data.data;
this.masterDataProficiencies = data.data;

  }
  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
  selectedProficiencyModel(newVal: any) {
    if(newVal !=='') {
      if (this.selectedProficiencies.length < ValueConstant.MAX_PROFECIENCES) {
        if(this.selectedProficiencies.indexOf(newVal)===-1){
          this.selectedProficiencies.push(newVal);
          this.deleteSelectedProfeciency(newVal);
          this.disablebutton=false;
          this.onComplete.emit(this.selectedProficiencies);
        }
      } else {
        this.showAlert = true;
      }
    }
    let emptyInputField: any = document.getElementById("proficiencyId");
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
    if(this.selectedProficiencies.length<=0){
      this.disablebutton=true;
    }
    this.onComplete.emit(this.selectedProficiencies);
  }

  deleteSelectedProfeciency(newVal:any) {
    this.Proficiencies.splice(this.Proficiencies.indexOf(newVal), 1);
  }

  showHideModal(newVal:any) { //TODO
    this.otherProficiency=newVal;

    if (newVal !== '' && this.masterDataProficiencies.indexOf(newVal) === -1)
      this.showModalStyle = !this.showModalStyle;
  }


  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  addProficiencyToMasterData() {
    this.showModalStyle = !this.showModalStyle;
    if(this.otherProficiency !=='') {
      for (let i = 0; i < this.masterDataProficiencies.length; i++) {
        if (this.masterDataProficiencies[i] === this.otherProficiency) {
          this.alreadyPresent = true;
        }
      }
      if (this.alreadyPresent === false) {
        this.proficiencydoaminService.addProficiencyToMasterData(this.otherProficiency).subscribe(
          data => {
            console.log(data);
          },
          error => {
            console.log(error);
          });
        this.selectedProficiencyModel(this.otherProficiency);
      }
    }
    this.alreadyPresent = false;
    let emptyInputField: any = document.getElementById("proficiencyId");
    emptyInputField.value = '';
  }

  onNext() {
    this.highlightedSection.name = "IndustryExposure";
  }
}
