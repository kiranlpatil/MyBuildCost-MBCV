import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Section} from "../model/candidate";
import {JobPosterModel} from "../model/jobPoster";
import {ValueConstant} from "../../../framework/shared/constants";


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
  tooltipMessage: string = '<ul><li>' +
      '<p>1. Enter key words for specialization in Technologies, Products, Tools, Domains etc. E.g Java, Oracle, SAP, Cognos, AWS, Agile, DevOps, CMM, Telecom Billing, Retail Banking etc.</p>' +
      '<p>2. Use the Top 5 "Must Have" key words to describe the most important skills. You can provide additional 20 key words that are "Nice to Have".</p></li></ul>';

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
    /* if (this.jobPosterModel.additionalProficiencies.length === 0) {
      this.showAdditional = false;
     }*/
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

















































































