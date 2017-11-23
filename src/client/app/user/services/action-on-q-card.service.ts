import {Injectable} from "@angular/core"
import {ErrorService} from "../../shared/services/error.service";
import {MessageService} from "../../shared/services/message.service";
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import {Candidate} from "../models/candidate";
import {CandidateQCard} from "../../cnext/framework/model/candidateQcard";
import {CandidateQListModel} from "../../cnext/framework/recruiter-dashboard/job-dashboard/q-cards-candidates";

@Injectable()

export class ActionOnQCardService {

  private addedToCart = new Subject<boolean>();
  private showModalStyle = new Subject<boolean>();
  private addForCompareView = new Subject<any>();
  private actionOnQCard = new Subject<any>();
  private selectedCandidate = new Subject<Candidate>();
  private actionOnValuePortrait = new Subject<any>();

  constructor() {

  }

  setActionOnQCard(action: string, sourceListName: string, destinationListName: string, candidate: CandidateQCard) {
    let obj = {action, sourceListName, destinationListName, candidate};
    this.actionOnQCard.next(obj);
  }

  getActionOnQCard(): Observable<any> {
    return this.actionOnQCard.asObservable();
  }

  setAddToCart(addedToCart: boolean) {
    this.addedToCart.next(addedToCart);
  }

  getCartStatus() : Observable<boolean>{
    return this.addedToCart.asObservable();
  }

  setValueForCompareView(addForCompareView: any) {
    this.addForCompareView.next(addForCompareView);
}

  getValueForCompareView() :Observable<any> {
    return this.addForCompareView.asObservable();
  }

  setShowModalStyle(showModalStyle: boolean) {
    this.showModalStyle.next(showModalStyle);
  }

  getShowModalStyle() : Observable<boolean>{
    return this.showModalStyle.asObservable();
  }

  setSelectedCandidate(selectedCandidate: any) {
    this.selectedCandidate.next(selectedCandidate);
  }

  getSelectedCandidate() :Observable<any> {
    return this.selectedCandidate.asObservable();
  }

  actionToBePerformedOnValuePortrait(data: any) {
    this.actionOnValuePortrait.next(data);
  }

  getActionOnValuePortrait(): Observable<any> {
    return this.actionOnValuePortrait.asObservable();
  }

  actionFromValuePortrait(data: any, candidateQlist: CandidateQListModel) {debugger
    let candidate: CandidateQCard;
    let type: string;
    let isFound: boolean = false;
    candidateQlist.rejectedCandidates.forEach(item => {
      if (data.candidateId == item._id) {
        candidate = item;
        isFound = true;
        type = 'rejectedList';
      }
    });
    if (!isFound) {
      candidateQlist.appliedCandidates.forEach(item => {
        if (data.candidateId == item._id) {
          candidate = item;
          isFound = true;
          type = 'applied';
        }
      })
    }
    if (!isFound) {
      candidateQlist.cartCandidates.forEach(item => {
        if (data.candidateId == item._id) {
          candidate = item;
          isFound = true;
          type = 'cartListed';
        }
      })
    }
    if (!isFound) {
      candidateQlist.matchedCandidates.forEach(item => {
        if (data.candidateId == item._id) {
          candidate = item;
          isFound = true;
          type = 'matchedList';
        }
      })
    }
    let result = {'candidate': candidate, 'type': type};
     return result;
  }

}