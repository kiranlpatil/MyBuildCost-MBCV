import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';
import {CandidateNumberDifferentList} from "./recruiter-dashboard/job-lister/candidate-diff-list";

@Injectable()
export class CandidateInCartService {

  // Observable string sources
  _showCandidateCartSource = new Subject<any>();

  // Observable string streams
  showCandidateCart$ = this._showCandidateCartSource.asObservable();

  // Service message commands
  change(candidates: any) {
    this._showCandidateCartSource.next(candidates);
  }
}
