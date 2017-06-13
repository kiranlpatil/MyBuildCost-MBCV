import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {CandidateQCard} from "./model/candidateQcard";

@Injectable()
export class RecruitercandidatesListsService {

  // Observable string sources
  _showRecruitercandidatesListSource = new Subject<CandidateQCard[]>();

  // Observable string streams
  showTest$ = this._showRecruitercandidatesListSource.asObservable();

  // Service message commands
  change(value: CandidateQCard[]) {
    this._showRecruitercandidatesListSource.next(value);
  }


}
