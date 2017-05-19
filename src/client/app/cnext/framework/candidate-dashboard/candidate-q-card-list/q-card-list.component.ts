import {Component,Input,EventEmitter,Output} from "@angular/core";
import {JobQcard} from "../../model/JobQcard";
import {CandidateFilter} from "../../model/candidate-filter";
import {FilterService} from "../../filters/filter.service";
import {QCardsortBy} from "../../model/q-cardview-sortby";

@Component({
  moduleId: module.id,
  selector: 'cn-q-card-list',
  templateUrl: 'q-card-list.component.html',
  styleUrls: ['q-card-list.component.css'],

})
export class QcardListComponent  {
  @Input() listOfJobs:JobQcard[];
  @Input() type:string;
  @Input() joblistCount:any;
  @Output() onAction=new EventEmitter();
  private filterMeta : CandidateFilter;
  private qCardModel: QCardsortBy = new QCardsortBy();

  constructor(private filterService:FilterService) {
    this.filterService.candidateFilterValue$.subscribe(
      (data: CandidateFilter) => {
        this.filterMeta = data;
      }
    );
  }

  onActionPerform(action:string){
    this.onAction.emit(action);
  }
  clearFilter() {
    this.filterService.clearFilter();
  }
}
