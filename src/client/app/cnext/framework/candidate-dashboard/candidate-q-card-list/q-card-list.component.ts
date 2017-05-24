import {Component, Input, EventEmitter, Output, OnChanges} from "@angular/core";
import {JobQcard} from "../../model/JobQcard";
import {CandidateFilter} from "../../model/candidate-filter";
import {QCardFilterService} from "../../filters/q-card-filter.service";
import {QCardsortBy} from "../../model/q-cardview-sortby";

@Component({
  moduleId: module.id,
  selector: 'cn-q-card-list',
  templateUrl: 'q-card-list.component.html',
  styleUrls: ['q-card-list.component.css'],

})
export class QcardListComponent implements OnChanges {
  @Input() listOfJobs:JobQcard[];
  @Input() type:string;
  @Input() joblistCount:any;
  @Output() onAction=new EventEmitter();
  private filterMeta : CandidateFilter;
  private qCardModel: QCardsortBy = new QCardsortBy();
  private qCardCount = {count:0};

  constructor(private qCardFilterService:QCardFilterService) {
    this.qCardFilterService.candidateFilterValue$.subscribe(
      (data: CandidateFilter) => {
        this.filterMeta = data;
      }
    );

  }

  ngOnChanges() {
    this.qCardCount.count = this.listOfJobs.length;
  }

  onActionPerform(action:string){
    this.onAction.emit(action);
  }
  clearFilter() {
    this.qCardFilterService.clearFilter();
  }
}
