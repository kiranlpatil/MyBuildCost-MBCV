import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Section} from "../../../user/models/candidate";
import {JobPosterModel} from "../../../user/models/jobPoster";
import {Headings, Tooltip} from "../../../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-compentacies-and-responsibilities',
  templateUrl: 'compentacies-and-responsibilities.component.html',
  styleUrls: ['compentacies-and-responsibilities.component.css']
})

export class CompetenciesAndResponsibilitiesComponent {
  @Input() jobPosterModel: JobPosterModel;
  @Input() highlightedSection: Section;
  @Input() isShowReleventIndustryListStep: boolean;
  @Output() onComplete = new EventEmitter();
  additionalInformatonHeaing:string=Headings.ADDITIONAL_INFORMATION;
  optionalFieldMessage:string=Headings.OPTIONAL;

  tooltipMessage: string = '<ul><li>' +
      '<p>1. '+ Tooltip.COMPETENCIES_AND_RESPONSIBILITIES_TOOLTIP_1+'</p>' +
      '<p>'+ Tooltip.COMPETENCIES_AND_RESPONSIBILITIES_TOOLTIP_2+'</p></li></ul>';

  onCompetenciesComplete(data: string) {
    this.jobPosterModel.competencies = data;
    this.onComplete.emit(this.jobPosterModel);
  }

  onResponsibilitiesComplete(data: string) {
    this.jobPosterModel.responsibility = data;
    this.onComplete.emit(this.jobPosterModel);
  }
  back() {
    (this.isShowReleventIndustryListStep)?this.highlightedSection.name='ReleventIndustry':this.highlightedSection.name='IndustryExposure';
    window.scrollTo(0, 0);
  }

  onEdit() {
    this.highlightedSection.name = 'Compentancies';
    window.scrollTo(0, 0);
  }

  onSave() {
    this.highlightedSection.name = 'None';
    window.scrollTo(0, 0);
  }
}
