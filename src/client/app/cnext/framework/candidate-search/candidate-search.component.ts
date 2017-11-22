import {Component, OnChanges} from "@angular/core";
import {CandidateSearchService} from "./candidate-search.service";
import {ErrorService} from "../../../shared/services/error.service";
import {CandidateSearch} from "../model/candidate-search";
import {JobQcard} from "../model/JobQcard";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate} from "../../../user/models/candidate";
import {CandidateDetail} from "../../../user/models/candidate-details";
import {Router, ActivatedRoute} from "@angular/router";
import {ImagePath, LocalStorage, Messages, UsageActions, ValueConstant} from "../../../shared/constants";
import {QCardViewService} from "../recruiter-dashboard/q-card-view/q-card-view.service";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {UsageTrackingService} from "../usage-tracking.service";
import {CandidateDetailsJobMatching} from "../model/candidate-details-jobmatching";
import {MessageService} from "../../../shared/services/message.service";
import {Message} from "../../../shared/models/message";
import {SearchEvent} from "../model/search-event";
import {SearchEventCompare} from "../model/search-event-compare";
import {QCardFilter} from "../model/q-card-filter";
import {ESort} from "../model/sort-type";
import {EList} from "../model/list-type";
import {UsageTracking} from "../model/usage-tracking";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-search',
  templateUrl: 'candidate-search.component.html',
  styleUrls: ['candidate-search.component.css']
})

export class CandidateSearchComponent implements OnChanges {

  searchValue: string = '';
  sortBy: ESort = ESort.BEST_MATCH;
  private showModalStyle: boolean = false;
  candidateDataList: CandidateSearch[] = new Array(0);
  listOfJobs: JobQcard[] = new Array(0);
  private candidateDetails: CandidateDetail = new CandidateDetail();
  candidate: Candidate = new Candidate();
  private userId: string;
  private msgSearchResultNotFound: string = Messages.MSG_CANDIDATE_SEARCH_NOT_FOUND;
  private msgCandidateNotFound: string = Messages.MSG_CANDIDATE_NOT_FOUND;
  private msgCandidateVisibilityOff: string = Messages.MSG_CNADIDATE_VISIBILITY_OFF;
  private msgCandidateIfNotInCart: string = Messages.MSG_CNADIDATE_IF_NOT_IN_CART;
  private candidateId: string;
  private jobId: string;
  private job: JobQcard;
  isShowJobCompareView: boolean = false;
  checkButttons: boolean;
  private candidateDetailsJobMatching: CandidateDetailsJobMatching = new CandidateDetailsJobMatching();
  inCartListedStatusForSearchView: boolean = false;
  inRejectListedStatusForSearchView: boolean = false;
  isCandidateFound: boolean;
  private isShowSuggestionToasterMsg: boolean = false;
  private appliedFilters: QCardFilter = new QCardFilter();


  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private candidateSearchService: CandidateSearchService,
              private usageTrackingService: UsageTrackingService,
              private errorService: ErrorService, private profileCreatorService: CandidateProfileService,
              private qCardViewService: QCardViewService, private messageService: MessageService) {

  }

  ngOnChanges(changes: any) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const _userId = params['id'];
      if (_userId) {
        this.getJobProfiles(_userId);
      }
    });
  }

  searchCandidate(value: string) {
    this.searchValue = value;
    if (value !== '' && value.length >= 3) {
      this.candidateSearchService.getCandidateByName(value)
        .subscribe(
          (res: any) => {
            this.candidateDataList = res.data;
          },
          error => this.errorService.onError(error)
        );
    } else {
      this.candidateDataList = new Array(0);
    }
  }

  getJobProfileMatching(item: CandidateSearch) {
    this.searchValue = item.first_name + ' ' + item.last_name;
    this.isCandidateFound = true;
    let usageTrackingData = new UsageTracking();
    usageTrackingData.action = UsageActions.SEARCHED_CANDIDATE_BY_RECRUITER;
    usageTrackingData.recruiterId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
    usageTrackingData.candidateId = item.id;
    this.usageTrackingService.addUsesTrackingData(usageTrackingData).subscribe(
      data => {
      }, error => this.errorService.onError(error));
    this._router.navigate(['/recruiter/search', item.id]);
  }

  getJobProfiles(candidateId: string) {
    this.appliedFilters = new QCardFilter();
    this.appliedFilters.sortBy = this.sortBy;
    this.appliedFilters.listName = EList.JOB_MATCHED;
    this.appliedFilters.recruiterId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
    this.candidateSearchService.getJobProfileMatching(candidateId, this.appliedFilters)
      .subscribe(
        (res: any) => {
          this.candidateDetailsJobMatching = <any>res.data;
          this.checkButttons = false;
          this.checkButttons = true;
          /*this.listOfJobs = this.candidateDetailsJobMatching.jobQCardMatching*/;
          this.listOfJobs = this.candidateDetailsJobMatching.jobQCardMatching;
          this.onCandidateDataSuccess(this.candidateDetailsJobMatching.candidateDetails);
          this.showModalStyle = false;
          this.candidateDataList = new Array(0);
        },
        error => this.errorService.onError(error)
      );
  }

  onCandidateDataSuccess(candidateData: any) {
    this.candidate = candidateData;
    this.candidateDetails = candidateData.personalDetails;
    this.searchValue = this.candidateDetails.first_name + ' ' + this.candidateDetails.last_name;
    this.candidateId = this.candidate.candidateId;
    this.userId = this.candidateDetails._id;
  }

  viewProfile(nav: string) {
    // if (!this.candidateDetailsJobMatching.isShowCandidateDetails) {
    this._router.navigate([nav, this.userId]);
    /* } else {
     this.isShowSuggestionToasterMsg = !this.isShowSuggestionToasterMsg;
     }*/
  }

  showSearchResult() {
    if (this.candidateDataList.length) {
      this.isCandidateFound = true;
      this.getJobProfileMatching(this.candidateDataList[0]);
    }
    else {
      this.candidateDetails = new CandidateDetail();
      this.candidate = new Candidate();
      this.listOfJobs = new Array(0);
      this.isCandidateFound = false;
    }
  }

  showJobCompareView(data: SearchEventCompare) {
    this.jobId = data.job._id;
    this.job = data.job;
    this.inCartListedStatusForSearchView = data.inCartStatus;
    this.inRejectListedStatusForSearchView = data.inRejectedStatus;
    this.candidateId = this.candidate.candidateId;
    this.isShowJobCompareView = true;
    this.showModalStyle = !this.showModalStyle;
  }

  getModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  closeJob() {
    this.isShowJobCompareView = false;
    this.showModalStyle = !this.showModalStyle;
  }

  workFlowAction(actionData: SearchEvent) {
    this.qCardViewService.updateCandidateLists(actionData.job._id, this.candidateId, actionData.actionName, 'add').subscribe(
      data => {
        let message = new Message();
        message.isError = false;
        if (actionData.actionName == ValueConstant.CART_LISTED_CANDIDATE) {
          message.custom_message = 'Candidate ' + this.candidateDetails.first_name + ' ' + this.candidateDetails.last_name + ' is added to your cart for job ' + actionData.job.jobTitle + '.';
        } else {
          message.custom_message = 'Candidate ' + this.candidateDetails.first_name + ' ' + this.candidateDetails.last_name + ' is rejected  for job ' + actionData.job.jobTitle + ' and moved to the rejected list.';
        }
        this.messageService.message(message);
        this.getJobProfiles(this.candidateId);
      }, error => this.errorService.onError(error)
    );
  }

  actionOnCard(value: string) {
    let searchEvent: SearchEvent = new SearchEvent();
    searchEvent.actionName = value;
    searchEvent.job = this.job;
    this.workFlowAction(searchEvent);
  }

  getImagePath() {
    return ImagePath;
  }

}
