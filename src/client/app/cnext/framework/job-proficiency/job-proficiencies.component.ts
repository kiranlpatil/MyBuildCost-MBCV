import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Section } from '../model/candidate';
import { JobPosterModel } from '../model/jobPoster';
import { ValueConstant } from '../../../framework/shared/constants';


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
  private showButton: boolean = true;
  private disablebutton: boolean = true;
  private showAdditional: boolean = false;
  private maxNumberOfMandatory: number;
  private maxNumberOfAdditional: number;
  tooltipMessage: string = "<ul><li><h5>Key Skills</h5>" +
      "<p class='info'>Enter all key words that describe the required area of expertise or specialization. " +
      "These Key Skills will be used for second level of matching post capability.</p></li></ul>";

  ngOnInit() {
    this.maxNumberOfMandatory = ValueConstant.MAX_MANDATORY_PROFECIENCES;
    this.maxNumberOfAdditional = ValueConstant.MAX_ADDITIONAL_PROFECIENCES;
  }

  onMandatoryProficiencyComplete(mandatory: string[]) {
    this.jobPosterModel.proficiencies = mandatory;
    this.onComplete.emit(this.jobPosterModel);
    if (this.jobPosterModel.proficiencies.length >= 5) {
      this.showAdditional = true;
    }
    if (mandatory.length > 0) {
      this.disablebutton = false;
    } else {
      this.disablebutton = true;
    }
  }

  onOptionalProficiencyComplete(optional: string[]) {
    this.jobPosterModel.additionalProficiencies = optional;
    this.onComplete.emit(this.jobPosterModel);
    if (this.jobPosterModel.additionalProficiencies.length === 0) {
      this.showAdditional = false;
    }
  }

  onNext() {
    this.highlightedSection.name = 'IndustryExposure';
    this.highlightedSection.isDisable = false;
    this.onNextComplete.emit();
  }

  onSave() {
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.onNextComplete.emit();
  }
}

















































































