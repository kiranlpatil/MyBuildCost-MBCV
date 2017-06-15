import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CandidateQCard } from './model/candidateQcard';

@Injectable()
export class RecruiterCandidatesListsService {

  // Observable string sources
  showRecruiterCandidatesListSource = new Subject<CandidateQCard[]>();

  // Observable string streams
  showTest$ = this.showRecruiterCandidatesListSource.asObservable();

  // Service message commands
  change(value: CandidateQCard[]) {
    this.showRecruiterCandidatesListSource.next(value);
  }


}
