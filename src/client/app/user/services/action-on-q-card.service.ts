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

  private jobId = new Subject<any>();
  private addForCompareView = new Subject<any>();
  //private actionOnQCard = new Subject<any>();
  private action = new Subject<any>();
  private actionOnViewProfile = new Subject<any>();

  constructor() {

  }

  /*setActionOnQCard(action: string, sourceListName: string, destinationListName: string, candidate: CandidateQCard) {
    let obj = {action, sourceListName, destinationListName, candidate};
    this.actionOnQCard.next(obj);
  }*/

  /*getActionOnQCard(): Observable<any> {
    return this.actionOnQCard.asObservable();
  }*/


  setValueForCompareView(addForCompareView: any) {
    this.addForCompareView.next(addForCompareView);
}

  getValueForCompareView() :Observable<any> {
    this.addForCompareView.observers.splice(0, this.addForCompareView.observers.length);
    return this.addForCompareView.asObservable();
  }

  actionToBePerformed(data: any) {
    this.action.next(data);
  }

  getAction(): Observable<any> {
    this.action.observers.splice(0, this.action.observers.length);
    return this.action.asObservable();
  }

  setJobId(jobId: string, type:string) {
    let obj = {'jobId': jobId, 'type': type};
    this.jobId.next(obj);
  }

  getJobId() : Observable<any> {
    this.jobId.observers.splice(0, this.jobId.observers.length);
    return this.jobId.asObservable();
  }

  actionFromValuePortrait(id: any, candidateQlist: CandidateQListModel) {
    let candidate: CandidateQCard;
    let source: string;
    let isFound: boolean = false;
    candidateQlist.rejectedCandidates.forEach(item => {
      if (id == item._id) {
        candidate = item;
        isFound = true;
        source = 'rejectedList';
      }
    });
    if (!isFound) {
      candidateQlist.appliedCandidates.forEach(item => {
        if (id == item._id) {
          candidate = item;
          isFound = true;
          source = 'applied';
        }
      })
    }
    if (!isFound) {
      candidateQlist.cartCandidates.forEach(item => {
        if (id == item._id) {
          candidate = item;
          isFound = true;
          source = 'cartListed';
        }
      })
    }
    if (!isFound) {
      candidateQlist.matchedCandidates.forEach(item => {
        if (id == item._id) {
          candidate = item;
          isFound = true;
          source = 'matchedList';
        }
      })
    }
    let result = {'candidate': candidate, 'source': source};
     return result;
  }

  setActionOnViewProfile(modelCandidate: any) {
    this.actionOnViewProfile.next(modelCandidate);
  }

  getActionOnViewProfile(): Observable<any> {
    this.actionOnViewProfile.observers.splice(0, this.actionOnViewProfile.observers.length);
    return this.actionOnViewProfile.asObservable();
  }

}
