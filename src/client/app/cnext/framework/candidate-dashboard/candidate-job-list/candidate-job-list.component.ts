import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobQcard } from '../../model/JobQcard';
import {QCardFilterService} from "../../filters/q-card-filter.service";
import {QCardFilter} from "../../model/q-card-filter";
import {QCardsortBy} from "../../model/q-cardview-sortby";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-job-list',
  templateUrl: 'candidate-job-list.component.html',
  styleUrls: ['candidate-job-list.component.css'],
})
export class CandidateJobListComponent {
  @Input() listOfJobs: JobQcard[];
  @Input() type: string;
  @Output() onAction = new EventEmitter();
  @Input() progress_bar_color : string;
  @Output() onSortByChange = new EventEmitter();
  private filterMeta: QCardFilter;
  private qCardModel: QCardsortBy = new QCardsortBy();
  private qCardCount = {count: 0};
  constructor(private qCardFilterService: QCardFilterService) {
    this.qCardFilterService.candidateFilterValue$.subscribe(
      (data: QCardFilter) => {
        this.filterMeta = data;
      }
    );

  }

  onActionPerform(action: string) {
    this.onAction.emit(action);
  }
  clearFilter() {
    this.qCardFilterService.clearFilter();
  }

  sortBy(value:string) {
    this.onSortByChange.emit(value);
  }
}
