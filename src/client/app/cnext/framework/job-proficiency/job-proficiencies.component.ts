import {Component, Input, EventEmitter, Output} from "@angular/core";
import {Section} from "../model/candidate";
import {JobPosterModel} from "../model/jobPoster";
import {ValueConstant} from "../../../framework/shared/constants";



@Component({
  moduleId: module.id,
  selector: 'cn-job-proficiencies',
  templateUrl: 'job-proficiencies.component.html',
  styleUrls: ['job-proficiencies.component.css']
})

export class JobProficienciesComponent {
  @Input() jobPosterModel:JobPosterModel;
  @Input() highlightedSection:Section;
  @Input() proficiencies:string[];
  @Output() onComplete = new EventEmitter();
  private showButton:boolean = true;
  private disablebutton:boolean = true;
  private maxNumberOfMandatory:number;
  private maxNumberOfAdditional:number;

  ngOnInit(){
    this.maxNumberOfMandatory=ValueConstant.MAX_MANDATORY_PROFECIENCES;
    this.maxNumberOfAdditional=ValueConstant.MAX_ADDITIONAL_PROFECIENCES;
  }

  onMandatoryProficiencyComplete(mandatory:string[]){
    this.jobPosterModel.proficiencies=mandatory;
    this.onComplete.emit(this.jobPosterModel);
    if(mandatory.length>0){
      this.disablebutton=false;
    } else {
      this.disablebutton=true;
    }
  }

  onOptionalProficiencyComplete(optional:string[]){
    this.jobPosterModel.additionalProficiencies=optional;
    this.onComplete.emit(this.jobPosterModel);
  }

  onNext() {
    this.highlightedSection.name = "IndustryExposure";
    this.highlightedSection.isDisable=false;
  }
  onSave() {
    this.highlightedSection.name = "none";
    this.highlightedSection.isDisable=false;

  }
}

















































































