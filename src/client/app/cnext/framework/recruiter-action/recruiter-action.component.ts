import {Component, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import {CandidateQCard} from "../model/candidateQcard";
import {Router, ActivatedRoute} from '@angular/router';
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Button, ValueConstant, UsageActions, LocalStorage} from "../../../shared/constants";
import {Candidate} from "../../../user/models/candidate";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {UsageTrackingService} from "../usage-tracking.service";
import {ErrorService} from "../../../shared/services/error.service";
import {CandidateDetail} from "../../../user/models/candidate-details";
import {Message} from "../../../shared/models/message";
import {MessageService} from "../../../shared/services/message.service";
import {CandidateQListModel} from "../recruiter-dashboard/job-dashboard/q-cards-candidates";
import {RecruiterJobView} from "../model/recruiter-job-view";
import {QCardViewService} from "../recruiter-dashboard/q-card-view/q-card-view.service";
import {JobPosterModel} from "../../../user/models/jobPoster";
import {ActionOnQCardService} from "../../../user/services/action-on-q-card.service";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-action',
  templateUrl: 'recruiter-action.component.html',
  styleUrls: ['recruiter-action.component.css']
})

export class RecruiterAction implements OnChanges {

  //@Input() candidate: Candidate;
  @Input() candidateQlist: CandidateQListModel = new CandidateQListModel();
  @Input() recuirterListCountModel: RecruiterJobView = new RecruiterJobView();
  @Input() candidate: any;
  @Input() jobId: string;
  @Input() type: string;
  @Input() isShortlistedclicked: boolean;
  @Input() isShowPrintView: boolean;
 // private modelCandidate: CandidateQCard;
  private selectedCandidate: Candidate = new Candidate();
  private candidateDetails: CandidateDetail = new CandidateDetail();
  private isAlreadyPresentInCart: boolean = false;
  private showModalStyle: boolean = false;


  constructor(private _router:Router,private profileCreatorService: CandidateProfileService,
              private usageTrackingService : UsageTrackingService,
              private errorService:ErrorService,
              private messageService: MessageService,
              private qCardViewService: QCardViewService,
              private actionOnQCardService: ActionOnQCardService) {

  }

  ngOnChanges(changes:any) {
    if(changes.candidate !== undefined && changes.candidate.currentValue !== undefined) {
      this.candidate = changes.candidate.currentValue;
    }
    if(changes.type !== undefined && changes.type.currentValue !== undefined) {
      this.type = changes.type.currentValue;
    }
    if(changes.isShortlistedclicked !== undefined && changes.isShortlistedclicked.currentValue !== undefined) {
      this.isShortlistedclicked = changes.isShortlistedclicked.currentValue;
    }
    if(changes.jobId !== undefined && changes.jobId.currentValue !== undefined) {
      this.jobId = changes.jobId.currentValue;
    }
    if(changes.isShowPrintView !== undefined && changes.isShowPrintView.currentValue !== undefined) {
      this.isShowPrintView = changes.isShowPrintView.currentValue;
    }
  }

  viewProfile(candidate: CandidateQCard) {
    this.actionOnQCardService.setActionOnViewProfile(candidate);
  }

  OnCandidateDataSuccess(candidate: any) {
    //this.selectedCandidate = candidate.data;
    this.actionOnQCardService.setSelectedCandidate(candidate.data);
    this.candidateDetails = candidate.metadata;
    this.showModalStyle = !this.showModalStyle;
    this.actionOnQCardService.setShowModalStyle(this.showModalStyle);
  }

  addForCompareView(value: any,sorceName:string) {
    var obj= {'id':value._id,'sorceName':sorceName};
    //this.addForCompare.emit(obj);
    this.actionOnQCardService.setValueForCompareView(obj);
    var message = new Message();
    message.isError = false;
    message.custom_message = 'Candidate' + ' ' + value.first_name + ' ' + value.last_name + ' added to compare view.';
    this.messageService.message(message);
  }

  navigateWithId(nav: string, candidate: CandidateQCard) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidate._id).subscribe(
      candidateData => {
        this._router.navigate([nav, candidateData.data.userId,{jobId: this.jobId}]); //todo Rahul get only userId
      });
  }

  navigateToApplicantSearch(nav: string, candidate: CandidateQCard) {
    this._router.navigate([nav, candidate._id]);
  }

  getButtons() {
    return Button;
  }

  /*actionOnQCard(action: string, sourceListName: string, destinationListName: string, candidate: CandidateQCard) {
    this.actionOnQCardService.setActionOnQCard(action, sourceListName, destinationListName, candidate);
  }*/

  actionToBePerformed(action:string, destination:string, item: any) {
    let data = {'action': action, 'destination': destination, 'item': item};
    this.actionOnQCardService.actionToBePerformed(data);
  }


  actionOnQCard(action: string, sourceListName: string, destinationListName: string, candidate: CandidateQCard) {
    let isMatchList: boolean = false;
    let isFound : boolean=false;
    switch (sourceListName) {
      case ValueConstant.APPLIED_CANDIDATE :
        /*
         this.candidateQlist.appliedCandidates.splice(this.candidateQlist.appliedCandidates.indexOf(candidate), 1);
         */

        break;
      case ValueConstant.REJECTED_LISTED_CANDIDATE :
        this.candidateQlist.rejectedCandidates.splice(this.candidateQlist.rejectedCandidates.indexOf(candidate), 1);
        isFound=false;
        for(let item of this.candidateQlist.matchedCandidates){
          if(item._id === candidate._id) {
            isFound=true;
          }
        }
        if(!isFound) {
          if (candidate.isVisible == undefined || candidate.isVisible) {
            this.candidateQlist.matchedCandidates.push(candidate);
          }
        }
        break;
      case ValueConstant.CART_LISTED_CANDIDATE :
        this.isShowPrintView = false;
        this.candidateQlist.cartCandidates.splice(this.candidateQlist.cartCandidates.indexOf(candidate), 1);
        isFound=false;
        for(let item of this.candidateQlist.matchedCandidates){
          if(item._id === candidate._id) {
            isFound=true;
          }
        }
        if(!isFound) {
          if (candidate.isVisible == undefined || candidate.isVisible) {
            this.candidateQlist.matchedCandidates.push(candidate);
          }
        }
        break;
      case ValueConstant.SHORT_LISTED_CANDIDATE :
//        this.candidateQlist.shortListedCandidates.splice(this.candidateQlist.shortListedCandidates.indexOf(candidate),1);
        break;
      case ValueConstant.MATCHED_CANDIDATE :
        this.candidateQlist.matchedCandidates.splice(this.candidateQlist.matchedCandidates.indexOf(candidate), 1);
        if (destinationListName == ValueConstant.CART_LISTED_CANDIDATE) {
          this.candidateQlist.cartCandidates.push(candidate);
        }
        if (destinationListName == ValueConstant.REJECTED_LISTED_CANDIDATE) {
          this.candidateQlist.rejectedCandidates.push(candidate);
        }
        this.recuirterListCountModel.numberOfMatchedCandidates = this.candidateQlist.matchedCandidates.length;
        isMatchList = true;
        break;
    }
    if (action === 'add' && !isMatchList && sourceListName !== ValueConstant.APPLIED_CANDIDATE) {
      this.qCardViewService.updateCandidateLists(this.jobId, candidate._id, sourceListName, 'remove').subscribe(
        data => {
          this.updateCountModel(data.data);
        }
      );
    } else if (action === 'remove') {
      this.recuirterListCountModel.numberOfMatchedCandidates++;
    }
    this.qCardViewService.updateCandidateLists(this.jobId, candidate._id, destinationListName, action).subscribe(
      data => {
        this.updateCountModel(data.data);
      }
    );
    this.showModalStyle = false;
    this.actionOnQCardService.setShowModalStyle(this.showModalStyle);

    if (destinationListName === ValueConstant.CART_LISTED_CANDIDATE && ( sourceListName === ValueConstant.MATCHED_CANDIDATE || sourceListName === ValueConstant.APPLIED_CANDIDATE )) {

      for (let candidateInApplied of this.candidateQlist.appliedCandidates) {
        for (let candidateInCart  of this.candidateQlist.cartCandidates) {
          if (candidateInApplied._id === candidateInCart._id) {
            this.isAlreadyPresentInCart = true;
          }
        }
      }
      if (!this.isAlreadyPresentInCart)
       // this.addedTocart.emit(true);
        this.actionOnQCardService.setAddToCart(true);

      this.isAlreadyPresentInCart = false;
    }

    if (destinationListName === ValueConstant.CART_LISTED_CANDIDATE && sourceListName === ValueConstant.APPLIED_CANDIDATE) {
      isFound=false;
      for(let item of this.candidateQlist.cartCandidates){
        if(item._id === candidate._id) {
          isFound=true;
        }
      }
      if(!isFound) {
        this.candidateQlist.cartCandidates.push(candidate);
      }
    }

    if (destinationListName === ValueConstant.REJECTED_LISTED_CANDIDATE && sourceListName === ValueConstant.APPLIED_CANDIDATE) {
      isFound=false;
      for(let item of this.candidateQlist.rejectedCandidates) {
        if(item._id === candidate._id) {
          isFound=true;
        }
      }
      if(!isFound) {
        this.candidateQlist.rejectedCandidates.push(candidate);
      }
    }

    if (sourceListName === ValueConstant.CART_LISTED_CANDIDATE && (destinationListName === ValueConstant.CART_LISTED_CANDIDATE || destinationListName === ValueConstant.REJECTED_LISTED_CANDIDATE))
     // this.addedTocart.emit(false);
      this.actionOnQCardService.setAddToCart(false);
    if(destinationListName==='cartListed'&& action==='add') {this.displayMsg('cartListed',candidate);}
    if(destinationListName==='rejectedList'&& action==='add') {this.displayMsg('rejectedList',candidate);}
    if (destinationListName === 'cartListed' && action === 'remove' && (candidate.isVisible == undefined || candidate.isVisible)) {
      this.displayMsg('removedcartListed', candidate);
    }
    if (destinationListName === 'rejectedList' && action === 'remove' && (candidate.isVisible == undefined || candidate.isVisible)) {
      this.displayMsg('removedrejectedList', candidate);
    }

  }

  displayMsg(condition:string,candidate: CandidateQCard) {
    var message = new Message();
    message.isError = false;
    if(condition==='cartListed') {message.custom_message = 'Candidate '+candidate.first_name+' '+candidate.last_name+' is added to your cart.';}
    if(condition==='rejectedList') {message.custom_message = 'Candidate '+candidate.first_name+' '+candidate.last_name+' is rejected and moved to the rejected list.';}
    if(condition==='removedcartListed') {message.custom_message = 'Candidate '+candidate.first_name+' '+candidate.last_name+' moved back to candidate listing from cart.';}
    if(condition==='removedrejectedList') {message.custom_message = 'Candidate '+candidate.first_name+' '+candidate.last_name+' moved back to candidate listing from rejected section.';}
    this.messageService.message(message);
  }

  updateCountModel(data: JobPosterModel) { //todo remove this unwanted code --abhijeet
    let job = data;
    for (let candidateItem of job.candidate_list) {
      if (candidateItem.name === ValueConstant.APPLIED_CANDIDATE) {
        this.recuirterListCountModel.numberOfCandidatesApplied = candidateItem.ids.length;
      }
      if (candidateItem.name === ValueConstant.CART_LISTED_CANDIDATE) {
        this.recuirterListCountModel.numberOfCandidatesInCart = candidateItem.ids.length;
      }
      if (candidateItem.name === ValueConstant.REJECTED_LISTED_CANDIDATE) {
        this.recuirterListCountModel.numberOfCandidatesrejected = candidateItem.ids.length;
      }
    }
  }

}