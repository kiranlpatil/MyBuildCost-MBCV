import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Section } from '../model/candidate';
import { JobPosterModel } from '../model/jobPoster';
import { Tooltip } from '../../../framework/shared/constants';

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

  tooltipMessage: string = '<ul><li>' +
      '<p>'+ Tooltip.COMPETENCIES_AND_RESPONSIBILITIES_TOOLTIP+'</p></li></ul>';

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
  }
}
