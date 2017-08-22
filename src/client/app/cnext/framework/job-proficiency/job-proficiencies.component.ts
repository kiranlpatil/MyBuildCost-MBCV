import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Section} from "../model/candidate";
import {JobPosterModel} from "../model/jobPoster";
import {Messages, Tooltip, ValueConstant, Headings} from "../../../framework/shared/constants";


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
  private disablebutton: boolean = true;
  private submitStatus: boolean = false;
  private showAdditional: boolean = false;
  private maxNumberOfMandatory: number;
  private maxNumberOfAdditional: number;
  private requiredKeySkillsValidationMessage = Messages.MSG_ERROR_VALIDATION_KEYSKILLS_REQUIRED;
  private maxKeySkillsValidationMessage = Messages.MSG_ERROR_VALIDATION_MAX_SKILLS_CROSSED + ValueConstant.MAX_MANDATORY_PROFECIENCES;
  tooltipMessage: string = '<ul><li>' +
      '<p>1. '+ Tooltip.JOB_PROFICIENCIES_TOOLTIP_1+'</p>' +
      '<p>2. '+Tooltip.JOB_PROFICIENCIES_TOOLTIP_2+'</p></li></ul>';

  ngOnInit() {
    this.maxNumberOfMandatory = ValueConstant.MAX_MANDATORY_PROFECIENCES;
    this.maxNumberOfAdditional = ValueConstant.MAX_ADDITIONAL_PROFECIENCES;
  }

  onMandatoryProficiencyComplete(mandatory: string[]) {
    this.jobPosterModel.proficiencies = mandatory;
    this.submitStatus=false;
    this.onComplete.emit(this.jobPosterModel);
    if (this.jobPosterModel.proficiencies.length >= ValueConstant.MAX_MANDATORY_PROFECIENCES) {
      this.showAdditional = true;
    }
  }

  onOptionalProficiencyComplete(optional: string[]) {
    this.jobPosterModel.additionalProficiencies = optional;
    this.onComplete.emit(this.jobPosterModel);
    /* if (this.jobPosterModel.additionalProficiencies.length === 0) {
      this.showAdditional = false;
     }*/
  }

  onNext() {
    if (this.jobPosterModel.proficiencies.length <= 0) {
      this.submitStatus = true;
      return;
    }
    this.highlightedSection.name = 'IndustryExposure';
    this.highlightedSection.isDisable = false;
    this.onNextComplete.emit();
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onSave() {
    if (this.jobPosterModel.proficiencies.length <= 0) {
      this.submitStatus = true;
      return;
    }
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.onNextComplete.emit();
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onPrevious() {
    this.highlightedSection.name = 'Complexities';
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onEdit() {
    this.highlightedSection.name = 'Proficiencies';
    this.disablebutton = false;
    this.showButton = false;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }
}

















































































