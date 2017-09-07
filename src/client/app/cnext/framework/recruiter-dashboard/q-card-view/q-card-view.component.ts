import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {CandidateQCard} from "../../model/candidateQcard";
import {QCardsortBy} from "../../model/q-cardview-sortby";
import {MatchCandidate} from "../../model/match-candidate";
import {QCardViewService} from "./q-card-view.service";
import {QCardFilterService} from "../../filters/q-card-filter.service";
import {AppSettings, ValueConstant} from "../../../../framework/shared/constants";
import {QCardFilter} from "../../model/q-card-filter";
import {CandidateQListModel} from "../job-dashboard/q-cards-candidates";
import {RecruiterJobView} from "../../model/recruiter-job-view";
import {Candidate} from "../../model/candidate";
import {CandidateDetail} from "../../../../framework/registration/candidate/candidate";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {Message} from "../../../../framework/shared/message";
import {MessageService} from "../../../../framework/shared/message.service";
import {ErrorService} from "../../error.service";
/*import underline = Chalk.underline;*/


@Component({
  moduleId: module.id,
  selector: 'cn-q-card-view',
  templateUrl: 'q-card-view.component.html',
  styleUrls: ['q-card-view.component.css'],

})
export class QCardviewComponent implements OnChanges {

  @Input() candidateQlist: CandidateQListModel = new CandidateQListModel();
  @Input() candidates: CandidateQCard[];
  @Input() recuirterListCountModel: RecruiterJobView = new RecruiterJobView();
  @Input() jobId: string;
  @Input() type: string;
  @Input() filterMeta: QCardFilter;
  @Output() addedTocart: EventEmitter<any> = new EventEmitter<any>();
  @Input() progress_bar_color : string='#0d75fa';
  @Output() addForCompare: EventEmitter<any> = new EventEmitter<any>();
  public qCardModel: QCardsortBy = new QCardsortBy();
  public totalQCardMatches = {count: 0};
  public qCardCount = {count: 0};
  private emailsOfShrortListedCandidates: string[] = new Array(0);
  private match: MatchCandidate = new MatchCandidate();
  /*private filterMeta: QCardFilter;*/
  private matchFormat: string = 'aboveMatch';
  private selectedCandidate: Candidate = new Candidate();
  private modelCandidate: CandidateQCard = new CandidateQCard();
  private candidateDetails: CandidateDetail = new CandidateDetail();
  private showModalStyle: boolean = false;
  private isAlreadyPresentInCart: boolean = false;
  private isShortlistedclicked: boolean = false;



  constructor(private qCardFilterService: QCardFilterService, private errorService:ErrorService,
              private profileCreatorService: CandidateProfileService, private qCardViewService: QCardViewService, private messageService: MessageService) {

    this.qCardFilterService.aboveMatch$.subscribe(
      () => {
        this.matchFormat = this.match.aboveMatch;
      }
    );
  }

  ngOnInlit() {
    this.matchFormat = 'aboveMatch';
  }

  ngOnChanges(changes: any) {
    if (changes.candidateQlist && changes.candidateQlist.currentValue) {
      if (changes.candidateQlist.currentValue.shortListedCandidates) {
        this.emailsOfShrortListedCandidates = new Array(0);
        for (let candidate of changes.candidateQlist.currentValue.shortListedCandidates) {
          this.emailsOfShrortListedCandidates.push(candidate.email);
        }
      }
    }
  }

  actionOnQCardFromParent(data:any) {
    var candidate:CandidateQCard;
    var isFound:boolean = false;
    this.candidateQlist.rejectedCandidates.forEach(item=> {
      if (data.id == item._id) {
        candidate = item;
        isFound = true;
      }
    });
    if (!isFound) {
      this.candidateQlist.appliedCandidates.forEach(item=> {
        if (data.id == item._id) {
          candidate = item;
          isFound = true;
        }
      })
    }
    if (!isFound) {
      this.candidateQlist.cartCandidates.forEach(item=> {
        if (data.id == item._id) {
          candidate = item;
          isFound = true;
        }
      })
    }
    if (!isFound) {
      this.candidateQlist.matchedCandidates.forEach(item=> {
        if (data.id == item._id) {
          candidate = item;
          isFound = true;
        }
      })
    }
    this.actionOnQCard(data.action, data.source, data.destination, candidate);

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
          this.updateCountModel(data);
        }
      );
    } else if (action === 'remove') {
      if ((candidate.isVisible == undefined || !candidate.isVisible) && (destinationListName === 'cartListed' ||
        destinationListName === 'rejectedList')) {

      } else {
        this.recuirterListCountModel.numberOfMatchedCandidates++;
      }
    }
    this.qCardViewService.updateCandidateLists(this.jobId, candidate._id, destinationListName, action).subscribe(
      data => {
        this.updateCountModel(data);
      }
    );
    this.showModalStyle = false;

    if (destinationListName === ValueConstant.CART_LISTED_CANDIDATE && ( sourceListName === ValueConstant.MATCHED_CANDIDATE || sourceListName === ValueConstant.APPLIED_CANDIDATE )) {

      for (let candidateInApplied of this.candidateQlist.appliedCandidates) {
        for (let candidateInCart  of this.candidateQlist.cartCandidates) {
          if (candidateInApplied._id === candidateInCart._id) {
            this.isAlreadyPresentInCart = true;
          }
        }
      }
      if (!this.isAlreadyPresentInCart)
        this.addedTocart.emit(true);

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
      this.addedTocart.emit(false);
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

  addRemoveToShortList(candidate: CandidateQCard) {
    this.isShortlistedclicked=true;
    let action: string;
    (this.emailsOfShrortListedCandidates.indexOf(candidate.email) !== -1) ? action = 'remove' : action = 'add';
    if (action === 'add') {
      this.emailsOfShrortListedCandidates.push(candidate.email);
    } else {
      this.emailsOfShrortListedCandidates.splice(this.emailsOfShrortListedCandidates.indexOf(candidate.email), 1);
    }
    this.qCardViewService.updateCandidateLists(this.jobId, candidate._id, ValueConstant.SHORT_LISTED_CANDIDATE, action).subscribe(
      data => {
        this.updateCountModel(data);
      },error => this.errorService.onError(error)
    );
  }

  updateCountModel(data: any) {
    var _jobId = this.jobId;
    var item = data.data.postedJobs.filter(function (item: any) {
      return (item._id === _jobId);
    });
    for (let candidateItem of item[0].candidate_list) {
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
    //this.recuirterListCountModel.numberOfMatchedCandidates -= (this.recuirterListCountModel.numberOfCandidatesrejected + this.recuirterListCountModel.numberOfCandidatesInCart);
  }

  clearFilter() {
    this.qCardFilterService.clearFilter();
  }

  matching(value: any) {
    this.matchFormat = value;
  }

  changeSort() {
    if (this.type !== 'matchedList') {
      this.matchFormat = this.match.belowMatch;
    }
  }

  viewProfile(candidate: CandidateQCard) {
    if(!this.isShortlistedclicked) {
      this.modelCandidate = candidate;
      this.profileCreatorService.getCandidateDetailsOfParticularId(candidate._id).subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData),
        error => this.errorService.onError(error));
    }
    this.isShortlistedclicked=false;
  }

  OnCandidateDataSuccess(candidate: any) {
    this.selectedCandidate = candidate.data;
    this.candidateDetails = candidate.metadata;
    this.showModalStyle = !this.showModalStyle;

    //    this.candidateDetails = candidateData.metadata;
  }

  getStyleModal() {//TODO remove this from all model
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  closeJob() {
    this.showModalStyle = !this.showModalStyle;
  }

  getImagePath(imagePath: string) {
    if (imagePath !== undefined) {
      return AppSettings.IP + imagePath.substring(4).replace('"', '');
    }
    return null;
  }

  addForCompareView(value: any,sorceName:string) {
    var obj= {'id':value._id,'sorceName':sorceName};
    this.addForCompare.emit(obj);
    var message = new Message();
    message.isError = false;
    message.custom_message = 'Candidate' + ' ' + value.first_name + ' ' + value.last_name + ' added to compare view.';
    this.messageService.message(message);
  }
}
