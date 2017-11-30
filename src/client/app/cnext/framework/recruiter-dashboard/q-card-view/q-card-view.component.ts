import {Component, EventEmitter, Input, OnChanges, Output, OnInit} from "@angular/core";
import {CandidateQCard} from "../../model/candidateQcard";
import {QCardsortBy} from "../../model/q-cardview-sortby";
import {MatchCandidate} from "../../model/match-candidate";
import {QCardViewService} from "./q-card-view.service";
import {QCardFilterService} from "../../filters/q-card-filter.service";
import {AppSettings, LocalStorage, UsageActions, ValueConstant, Button} from "../../../../shared/constants";
import {QCardFilter} from "../../model/q-card-filter";
import {CandidateQListModel} from "../job-dashboard/q-cards-candidates";
import {RecruiterJobView} from "../../model/recruiter-job-view";
import {Candidate} from "../../../../user/models/candidate";
import {CandidateDetail} from "../../../../user/models/candidate-details";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {Message} from "../../../../shared/models/message";
import {MessageService} from "../../../../shared/services/message.service";
import {ErrorService} from "../../../../shared/services/error.service";
import {UsageTrackingService} from "../../usage-tracking.service";
import {LocalStorageService} from "../../../../shared/services/localstorage.service";
import {ESort} from "../../model/sort-type";
import {JobPosterModel} from "../../../../user/models/jobPoster";
import {Router, ActivatedRoute} from "@angular/router";
import {UsageTracking} from "../../model/usage-tracking";
import {ActionOnQCardService} from "../../../../user/services/action-on-q-card.service";
/*import underline = Chalk.underline;*/


@Component({
  moduleId: module.id,
  selector: 'cn-q-card-view',
  templateUrl: 'q-card-view.component.html',
  styleUrls: ['q-card-view.component.css'],

})
export class QCardviewComponent implements OnChanges, OnInit {

  @Input() candidateQlist: CandidateQListModel = new CandidateQListModel();
  @Input() candidates: CandidateQCard[];
  @Input() recuirterListCountModel: RecruiterJobView = new RecruiterJobView();
  @Input() jobId: string;
  @Input() type: string;
  @Input() filterMeta: QCardFilter;
  @Input() isJobPostExpired: boolean;
  @Input() isJobPostClosed: boolean;
  @Output() addedTocart: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeSorting: EventEmitter<ESort> = new EventEmitter<ESort>();
  @Input() progress_bar_color: string = '#0d75fa';
  @Output() addForCompare: EventEmitter<any> = new EventEmitter<any>();
  public qCardModel: QCardsortBy = new QCardsortBy();
  public totalQCardMatches = {count: 0};
  public qCardCount = {count: 0};
  private emailsOfShrortListedCandidates: string[] = new Array(0);
  private match: MatchCandidate = new MatchCandidate();
  /*private filterMeta: QCardFilter;*/
  matchFormat: string = 'aboveMatch';
  private selectedCandidate: Candidate = new Candidate();
  private modelCandidate: CandidateQCard = new CandidateQCard();
  private candidateDetails: CandidateDetail = new CandidateDetail();
  private showModalStyle: boolean;
  private isAlreadyPresentInCart: boolean = false;
  private isShortlistedclicked: boolean = false;
  isShowPrintView: boolean = false;



  constructor(private qCardFilterService: QCardFilterService,
              private usageTrackingService : UsageTrackingService,
              private errorService:ErrorService,
              private profileCreatorService: CandidateProfileService,
              private qCardViewService: QCardViewService,
              private messageService: MessageService,
              private _router:Router,
              private actionOnQCardService: ActionOnQCardService) {

    this.qCardFilterService.aboveMatch$.subscribe(
      () => {
        this.matchFormat = this.match.aboveMatch;
      }
    );
    this.actionOnQCardService.getShowModalStyle()
      .subscribe( showModalStyle => {
        this.showModalStyle = showModalStyle
      });
  }

  ngOnInit() {
    this.matchFormat = 'aboveMatch';
    this.getSelectedCandidate();
    //this.getAction();
    this.getActionOnViewProfile();
  }

  getSelectedCandidate() {
    this.actionOnQCardService.getSelectedCandidate()
      .subscribe( selectedCandidate => {
        this.selectedCandidate = selectedCandidate
      });
  }

  getAction() {
    this.actionOnQCardService.getAction().subscribe(actionOnValuePortrait => {
      let result = this.actionOnQCardService.actionFromValuePortrait(actionOnValuePortrait.item,this.candidateQlist);
      this.actionOnQCard(actionOnValuePortrait.action, result.source, actionOnValuePortrait.destination, result.candidate);
    });
  }

  getActionOnViewProfile() {
    this.actionOnQCardService.getActionOnViewProfile().subscribe(actionOnViewProfile => {
      this.viewProfile(actionOnViewProfile);
    });
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
    if (changes.isJobPostExpired && changes.isJobPostExpired.currentValue) {
      this.isJobPostExpired = changes.isJobPostExpired.currentValue;
    }
  }

//TODO: refactor below code proper ->use service for logic ->by krishna ghatul
  actionOnQCardFromParent(data: any) {
    let result = this.actionOnQCardService.actionFromValuePortrait(data.id, this.candidateQlist);
    this.actionOnQCard(data.action, result.source, data.destination, result.candidate);

  }

  actionOnQCard(action: string, sourceListName: string, destinationListName: string, candidate: CandidateQCard) { debugger
    let isMatchList: boolean = false;
    let isFound: boolean = false;
    switch (sourceListName) {
      case ValueConstant.APPLIED_CANDIDATE :
        /*
         this.candidateQlist.appliedCandidates.splice(this.candidateQlist.appliedCandidates.indexOf(candidate), 1);
         */

        break;
      case ValueConstant.REJECTED_LISTED_CANDIDATE :
        this.candidateQlist.rejectedCandidates.splice(this.candidateQlist.rejectedCandidates.indexOf(candidate), 1);
        isFound = false;
        for (let item of this.candidateQlist.matchedCandidates) {
          if (item._id === candidate._id) {
            isFound = true;
          }
        }
        if (!isFound) {
          if (candidate.isVisible == undefined || candidate.isVisible) {
            this.candidateQlist.matchedCandidates.push(candidate);
          }
        }
        break;
      case ValueConstant.CART_LISTED_CANDIDATE :
        this.isShowPrintView = false;
        this.candidateQlist.cartCandidates.splice(this.candidateQlist.cartCandidates.indexOf(candidate), 1);
        isFound = false;
        for (let item of this.candidateQlist.matchedCandidates) {
          if (item._id === candidate._id) {
            isFound = true;
          }
        }
        if (!isFound) {
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
      /*if ((candidate.isVisible == undefined || !candidate.isVisible) && (destinationListName === 'cartListed' ||
       destinationListName === 'rejectedList')) {
       } else {
       }*/
    }
    this.qCardViewService.updateCandidateLists(this.jobId, candidate._id, destinationListName, action).subscribe(
      data => {
        this.updateCountModel(data.data);
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
      isFound = false;
      for (let item of this.candidateQlist.cartCandidates) {
        if (item._id === candidate._id) {
          isFound = true;
        }
      }
      if (!isFound) {
        this.candidateQlist.cartCandidates.push(candidate);
      }
    }

    if (destinationListName === ValueConstant.REJECTED_LISTED_CANDIDATE && sourceListName === ValueConstant.APPLIED_CANDIDATE) {
      isFound = false;
      for (let item of this.candidateQlist.rejectedCandidates) {
        if (item._id === candidate._id) {
          isFound = true;
        }
      }
      if (!isFound) {
        this.candidateQlist.rejectedCandidates.push(candidate);
      }
    }

    if (sourceListName === ValueConstant.CART_LISTED_CANDIDATE && (destinationListName === ValueConstant.CART_LISTED_CANDIDATE || destinationListName === ValueConstant.REJECTED_LISTED_CANDIDATE))
      this.addedTocart.emit(false);
    if (destinationListName === 'cartListed' && action === 'add') {
      this.displayMsg('cartListed', candidate);
    }
    if (destinationListName === 'rejectedList' && action === 'add') {
      this.displayMsg('rejectedList', candidate);
    }
    if (destinationListName === 'cartListed' && action === 'remove' && (candidate.isVisible == undefined || candidate.isVisible)) {
      this.displayMsg('removedcartListed', candidate);
    }
    if (destinationListName === 'rejectedList' && action === 'remove' && (candidate.isVisible == undefined || candidate.isVisible)) {
      this.displayMsg('removedrejectedList', candidate);
    }

  }

  displayMsg(condition: string, candidate: CandidateQCard) {
    var message = new Message();
    message.isError = false;
    if (condition === 'cartListed') {
      message.custom_message = 'Candidate ' + candidate.first_name + ' ' + candidate.last_name + ' is added to your cart.';
    }
    if (condition === 'rejectedList') {
      message.custom_message = 'Candidate ' + candidate.first_name + ' ' + candidate.last_name + ' is rejected and moved to the rejected list.';
    }
    if (condition === 'removedcartListed') {
      message.custom_message = 'Candidate ' + candidate.first_name + ' ' + candidate.last_name + ' moved back to candidate listing from cart.';
    }
    if (condition === 'removedrejectedList') {
      message.custom_message = 'Candidate ' + candidate.first_name + ' ' + candidate.last_name + ' moved back to candidate listing from rejected section.';
    }
    this.messageService.message(message);
  }

  addRemoveToShortList(candidate: CandidateQCard) {
    this.isShortlistedclicked = true;
    let action: string;
    (this.emailsOfShrortListedCandidates.indexOf(candidate.email) !== -1) ? action = 'remove' : action = 'add';
    if (action === 'add') {
      this.emailsOfShrortListedCandidates.push(candidate.email);
    } else {
      this.emailsOfShrortListedCandidates.splice(this.emailsOfShrortListedCandidates.indexOf(candidate.email), 1);
    }
    this.qCardViewService.updateCandidateLists(this.jobId, candidate._id, ValueConstant.SHORT_LISTED_CANDIDATE, action).subscribe(
      data => {
        this.updateCountModel(data.data);
      }, error => this.errorService.onError(error)
    );
  }

  updateCountModel(data: JobPosterModel) { //todo remove this unwanted code --abhijeet
    //var _jobId = this.jobId;
    let job = data;
    /*var item = data.data.postedJobs.filter(function (item: any) {*/
    /* var item = data.filter(function (item: any) {
     return (item._id === _jobId);
     });*/
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
    //this.recuirterListCountModel.numberOfMatchedCandidates -= (this.recuirterListCountModel.numberOfCandidatesrejected + this.recuirterListCountModel.numberOfCandidatesInCart);
  }

  clearFilter() {
    this.qCardFilterService.clearFilter();
  }

  matching(value: any) {
    this.matchFormat = value;
  }

  changeSort() {

    switch (this.qCardModel.sortValue) {
      case 'Best match':
        this.changeSorting.emit(ESort.BEST_MATCH);
        break;
      case 'Experience' :
        this.changeSorting.emit(ESort.EXPERIENCE);
        break;
      case 'Salary' :
        this.changeSorting.emit(ESort.SALARY);
        break;
      default :
        this.changeSorting.emit(ESort.BEST_MATCH);
        break;
    }
    if (this.type !== 'matchedList') {
      this.matchFormat = this.match.belowMatch;
    }
  }

  viewProfile(candidate: CandidateQCard) {
    if (!this.isShortlistedclicked) {
      this.modelCandidate = candidate;
      let usageTrackingData: UsageTracking = new UsageTracking();
      usageTrackingData.recruiterId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
      usageTrackingData.jobProfileId = this.jobId;
      usageTrackingData.candidateId = this.modelCandidate._id;
      if (this.type !== ValueConstant.CART_LISTED_CANDIDATE) {
        usageTrackingData.action = UsageActions.VIEWED_HALF_PROFILE_BY_RECRUITER;
      } else {
        this.isShowPrintView = true;
        usageTrackingData.action = UsageActions.VIEWED_FULL_PROFILE_BY_RECRUITER;
      }
      this.usageTrackingService.addUsesTrackingData(usageTrackingData).subscribe(
        data => {
          console.log('');
        },
        err => {
          this.errorService.onError(err);
        }
      );
      this.profileCreatorService.getCandidateDetailsOfParticularId(candidate._id).subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData),
        error => this.errorService.onError(error));
    }
    this.isShortlistedclicked = false;
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
    this.isShowPrintView = false;
    this.showModalStyle = !this.showModalStyle;
  }

  getImagePath(imagePath: string) {
    if (imagePath !== undefined) {
      return AppSettings.IP + imagePath.replace('"', '');
    }
    return null;
  }

  addForCompareView(value: any, sorceName: string) {
    var obj = {'id': value._id, 'sorceName': sorceName};
    this.addForCompare.emit(obj);
    var message = new Message();
    message.isError = false;
    message.custom_message = 'Candidate' + ' ' + value.first_name + ' ' + value.last_name + ' added to compare view.';
    this.messageService.message(message);
  }

  navigateWithId(nav: string, candidate: CandidateQCard) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidate._id).subscribe(
      candidateData => {
        this._router.navigate([nav, candidateData.data.userId, {jobId: this.jobId}]); //todo Rahul get only userId
      });
  }

  navigateToApplicantSearch(nav: string, candidate: CandidateQCard) {
    let usageTrackingData: UsageTracking = new UsageTracking();
    usageTrackingData.recruiterId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
    usageTrackingData.jobProfileId = this.jobId;
    usageTrackingData.candidateId = candidate._id;
    usageTrackingData.action = UsageActions.MATCHED_CANDIDATE_AGAINST_ALL_JOB_BY_RECRUITER;
    this.usageTrackingService.addUsesTrackingData(usageTrackingData).subscribe(
      data => {
        this._router.navigate([nav, candidate._id]);
      },
      err => {
        this.errorService.onError(err);
      }
    );
  }

  getButtons() {
    return Button;
  }
}
