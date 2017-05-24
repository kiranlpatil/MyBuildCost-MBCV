import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {QCardFilter} from "../model/q-card-filter";

@Injectable()
export class QCardFilterService {

  // Observable string sources
  candidateFilter = new Subject<QCardFilter>();
  subjClearFilter = new Subject<any>();
  aboveMatchFilter = new Subject<any>();

  // Observable string streams
  candidateFilterValue$ = this.candidateFilter.asObservable();
  clearFilter$ = this.subjClearFilter.asObservable();
  aboveMatch$ = this.aboveMatchFilter.asObservable();

  clearFilter() {
    this.subjClearFilter.next();
  }

  filterby(data: QCardFilter) {
    this.candidateFilter.next(data);
  }

  setAboveMatch() {
    this.aboveMatchFilter.next();
  }
}
