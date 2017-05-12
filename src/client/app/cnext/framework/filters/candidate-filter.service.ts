import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {CandidateFilter} from "../model/candidate-filter";

@Injectable()
export class CandidateFilterService {

  // Observable string sources
  candidateFilter = new Subject<CandidateFilter>();

  // Observable string streams
  candidateFilterValue$ = this.candidateFilter.asObservable();

  filterby(data: CandidateFilter) {
    this.candidateFilter.next(data);
  }
}
