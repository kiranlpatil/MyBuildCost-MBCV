import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Section} from "../../../user/models/candidate";
import {JobPosterModel} from "../../../user/models/jobPoster";
import {Headings, Messages, Tooltip, ValueConstant} from "../../../shared/constants";


@Component({
  moduleId: module.id,
  selector: 'cn-job-proficiencies',
  templateUrl: 'job-proficiencies.component.html',
  styleUrls: ['job-proficiencies.component.css']
})

export class JobProficienciesComponent implements OnInit {
  @Input() jobPosterModel: JobPosterModel;
  @Input() highlightedSection: Section;
  @Input() proficiencies: string[];
  @Output() onComplete = new EventEmitter();
  @Output() onNextComplete = new EventEmitter();
  jobProficienciesHeading:string=Headings.JOB_PROFICIENCIES;
  mandatorySkills:string=Headings.MANDATORY_PROFICIENCIES;
  additionalSkills:string=Headings.ADDITIONAL_PROFICIENCIES;
  private showButton: boolean = true;
  private isshowModal: boolean = false;
  private disablebutton: boolean = true;
  private submitStatus: boolean = false;
  private showAdditional: boolean = false;
  private showModalStyle: boolean = false;
  private maxNumberOfMandatory: number;
  private maxNumberOfAdditional: number;
  private requiredKeySkillsValidationMessage = Messages.MSG_ERROR_VALIDATION_KEYSKILLS_REQUIRED;
  private maxKeySkillsValidationMessage = Messages.MSG_ERROR_VALIDATION_MAX_SKILLS_CROSSED + ValueConstant.MAX_MANDATORY_PROFECIENCES + Messages.MSG_ERROR_VALIDATION_MAX_PROFICIENCIES;
  tooltipMessage: string = '<ul>' +
      '<li><p>1. ' + Tooltip.JOB_PROFICIENCIES_TOOLTIP_1 + '</p></li>' +
      '<li><p>2. ' + Tooltip.JOB_PROFICIENCIES_TOOLTIP_2 + '</p></li></ul>';

  ngOnInit() {
    this.maxNumberOfMandatory = ValueConstant.MAX_MANDATORY_PROFECIENCES;
    this.maxNumberOfAdditional = ValueConstant.MAX_ADDITIONAL_PROFECIENCES;
  }

  onMandatoryProficiencyComplete(mandatory: string[]) {
    this.jobPosterModel.proficiencies = mandatory;
    this.submitStatus=false;
    this.onComplete.emit(this.jobPosterModel);
  }

  onNext() {
    if(this.jobPosterModel && this.jobPosterModel.proficiencies && this.jobPosterModel.proficiencies.length === 0 && !this.isshowModal){
      this.isshowModal=true;
    } else {
      this.highlightedSection.name = 'IndustryExposure';
      this.highlightedSection.isDisable = false;
      this.onNextComplete.emit();
      window.scrollTo(0, 0);
      this.isshowModal=false;
    }
  }

  onSave() {
    if(this.jobPosterModel && this.jobPosterModel.proficiencies && this.jobPosterModel.proficiencies.length === 0 && !this.isshowModal){
      this.isshowModal=true;
    } else {
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.onNextComplete.emit();
    window.scrollTo(0, 0);
    this.isshowModal=false;
    }
  }

  onPrevious() {
    this.highlightedSection.name = 'Complexities';
    window.scrollTo(0, 0);
  }

  onEdit() {
    this.highlightedSection.name = 'Proficiencies';
    this.disablebutton = false;
    this.showButton = false;
    window.scrollTo(0, 0);
  }
  getMessage() {
    return Messages;
  }

  getHeadings() {
    return Headings;
  }
}

















































































