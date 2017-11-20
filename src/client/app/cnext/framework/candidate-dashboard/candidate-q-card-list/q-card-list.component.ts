import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { JobQcard } from '../../model/JobQcard';
import { QCardFilterService } from '../../filters/q-card-filter.service';
import { QCardsortBy } from '../../model/q-cardview-sortby';
import { QCardFilter } from '../../model/q-card-filter';

@Component({
  moduleId: module.id,
  selector: 'cn-q-card-list',
  templateUrl: 'q-card-list.component.html',
  styleUrls: ['q-card-list.component.css'],

})
export class QcardListComponent implements OnChanges {
  @Input() listOfJobs: JobQcard[];
  @Input() type: string;
  @Input() joblistCount: any;
  @Output() onAction = new EventEmitter();
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

  ngOnChanges() {
    this.qCardCount.count = this.listOfJobs.length;
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
