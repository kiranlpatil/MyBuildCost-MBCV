import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {CandidateFilter} from "../model/candidate-filter";

@Injectable()
export class CandidateFilterService {

  // Observable string sources
  candidateFilter = new Subject<CandidateFilter>();
  subjClearFilter = new Subject<any>();

  // Observable string streams
  candidateFilterValue$ = this.candidateFilter.asObservable();
  clearFilter$ = this.subjClearFilter.asObservable();

  clearFilter() {
    this.subjClearFilter.next();
  }

  filterby(data: CandidateFilter) {
    this.candidateFilter.next(data);
  }
}
