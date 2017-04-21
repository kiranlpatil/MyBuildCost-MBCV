import {Component, Input, EventEmitter, Output} from "@angular/core";
import {ValueConstant} from "../../../framework/shared/constants";
import {Candidate} from "../model/candidate";
import {Proficiences} from "../model/proficiency";
import {ProficiencyDomainService} from "./proficiency-domain.service";

@Component({
  moduleId: module.id,
  selector: 'cn-proficiency-doamin',
  templateUrl: 'proficiency-domain.component.html',
  styleUrls: ['proficiency-domain.component.css']
})

export class ProficiencyDomainComponent {
  @Input('type') type: string;
  @Input() candidate: Candidate;
  @Input() proficiencies: Proficiences=new Proficiences();
  @Output() selectProficiency=new EventEmitter();


  private selectedProficiencies = new Array();
  private masterDataProficiencies = new Array();
  private showAlert: boolean = false;
  private proficiencyModel: string;
  private alreadyPresent:boolean=false;
  private showModalStyle:boolean = false;
  private otherProficiency:string ='';


  constructor(private proficiencydoaminService:ProficiencyDomainService ) {
  }


  ngOnChanges (changes:any) {
    if (changes.proficiencies != undefined) {
      if (changes.proficiencies.currentValue != undefined)
        this.proficiencies = changes.proficiencies.currentValue;
      if(this.candidate !== undefined){
      if(this.candidate.proficiencies.length > 0 ) {
        this.selectedProficiencies = this.candidate.proficiencies;
        this.masterDataProficiencies = this.candidate.proficiencies;
        for (let proficiency of this.candidate.proficiencies) {
          this.deleteSelectedProfeciency(proficiency);
        }
      }
    }
    }
  }

  selectedProficiencyModel(newVal: any) {
    if(newVal !=='') {
      if (this.selectedProficiencies.length < ValueConstant.MAX_PROFECIENCES) {
        this.selectedProficiencies.push(newVal);
        this.deleteSelectedProfeciency(newVal);
        this.selectProficiency.emit(this.selectedProficiencies);
      } else {
        this.showAlert = true;
      }
      this.proficiencyModel = '';
    }
    let tempCity: any = document.getElementById(this.type);
    tempCity.value = '';
  }

  deleteItem(newVal: any) {
    this.showAlert = false;
    for (let i = 0; i < this.selectedProficiencies.length; i++) {
      if (this.selectedProficiencies[i] === newVal.currentTarget.innerText.trim()) {
        this.selectedProficiencies.splice(i, 1);
        this.proficiencies.names.push(newVal.currentTarget.innerText.trim());
      }
    }
    this.selectProficiency.emit(this.selectedProficiencies);
  }

  deleteSelectedProfeciency(newVal: any) {
    this.proficiencies.names.splice(this.proficiencies.names.indexOf(newVal), 1);
  }

  showHideModal(newVal:any) { //TODO
    this.otherProficiency=newVal;
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
        this.proficiencydoaminService.addProficiencyToMasterData(this.otherProficiency, this.candidate.industry.name).subscribe(
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
    let tempCity: any = document.getElementById(this.type);
    tempCity.value = '';
  }
}
