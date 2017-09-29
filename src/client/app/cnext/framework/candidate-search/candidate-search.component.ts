import { Component, OnChanges} from '@angular/core';
import { CandidateSearchService} from './candidate-search.service';
import {ErrorService} from "../../../shared/services/error.service";
import { CandidateSearch} from '../model/candidate-search';
import {JobQcard} from '../model/JobQcard';
import {CandidateProfileService} from '../candidate-profile/candidate-profile.service';
import {Candidate} from '../../../user/models/candidate';
import {CandidateDetail} from '../../../user/models/candidate-details';
import {Router} from '@angular/router';
import {ImagePath, LocalStorage, Messages, UsageActions, ValueConstant} from '../../../shared/constants';
import {QCardViewService} from '../recruiter-dashboard/q-card-view/q-card-view.service';
import {LocalStorageService} from '../../../shared/services/localstorage.service';
import {UsageTrackingService} from '../usage-tracking.service';
import {CandidateDetailsJobMatching} from "../model/candidate-details-jobmatching";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-search',
  templateUrl: 'candidate-search.component.html',
  styleUrls: ['candidate-search.component.css']
})

export class CandidateSearchComponent implements OnChanges {

  private searchValue:string = "";
  private showModalStyle: boolean = false;
  private candidateDataList:CandidateSearch[] = new Array(0);
  private listOfJobs:JobQcard[] = new Array(0);
  private candidateDetails:CandidateDetail = new CandidateDetail();
  private candidate:Candidate = new Candidate();
  private userId:string;
  private msgSearchResultNotFound:string = Messages.MSG_CANDIDATE_SEARCH_NOT_FOUND;
  private msgCandidateNotFound:string = Messages.MSG_CANDIDATE_NOT_FOUND;
  private msgCandidateVisibilityOff:string = Messages.MSG_CNADIDATE_VISIBILITY_OFF;
  private msgCandidateIfNotInCart:string = Messages.MSG_CNADIDATE_IF_NOT_IN_CART;
  private candidateId:string;
  private jobId:string;
  private isShowJobCompareView:boolean = false;
  private checkButttons:boolean;
  private candidateDetailsJobMatching:CandidateDetailsJobMatching = new CandidateDetailsJobMatching();
  private inCartListedStatusForSearchView:boolean = false;
  private inRejectListedStatusForSearchView:boolean = false;
  private isCandidateFound:boolean;
  private isShowSuggestionTosterMsg:boolean = false;

  constructor(private _router:Router, private candidateSearchService:CandidateSearchService,
              private usageTrackingService : UsageTrackingService,
              private errorService:ErrorService, private profileCreatorService:CandidateProfileService,
              private qCardViewService:QCardViewService) {

  }

  ngOnChanges(changes:any) {

  }

  searchCandidate(value:string) {
    this.searchValue = value;
    if (value !== '') {
      this.candidateSearchService.getCandidateByName(value)
        .subscribe(
          (res:any) => {
            this.candidateDataList = res.data;
          },
          error => this.errorService.onError(error)
        );
    } else {
      this.candidateDataList = new Array(0);
    }
  }

  getJobProfileMatching(item:CandidateSearch) {
    this.searchValue = item.first_name + " " + item.last_name;
    this.isCandidateFound = true;
    this.getJobProfiles(item.id);
  }

  getJobProfiles(candidateId:string) {
    this.candidateSearchService.getJobProfileMatching(candidateId)
      .subscribe(
        (res:any) => {
          this.candidateDetailsJobMatching = <CandidateDetailsJobMatching>res.data;
          this.checkButttons = false;
          this.checkButttons = true;
          this.listOfJobs = this.candidateDetailsJobMatching.jobQCardMatching;
          this.onCandidateDataSuccess(this.candidateDetailsJobMatching.candidateDetails);
          this.showModalStyle = false;
          this.candidateDataList = new Array(0);
        },
        error => this.errorService.onError(error)
      );
  }

  onCandidateDataSuccess(candidateData:any) {
    this.candidate = candidateData;
    this.candidateDetails = <CandidateDetail>candidateData.userId;
    this.candidateId = this.candidate._id;
    this.userId = this.candidateDetails._id;
  }

  viewProfile(nav:string) {
    if (!this.candidateDetailsJobMatching.isShowCandidateDetails) {
      this.usageTrackingService.addUsesTrackingData(UsageActions.VIEWED_VALUE_PORTRAIT_BY_RECRUITER,
        LocalStorageService.getLocalValue(LocalStorage.END_USER_ID), this.jobId, this.candidateId).subscribe(
        data  => {
          console.log(''+data);
        }, error => this.errorService.onError(error));
      this._router.navigate([nav, this.userId]);
    } else {
      this.isShowSuggestionTosterMsg = !this.isShowSuggestionTosterMsg;
    }
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

  showJobCompareView(data:any) {
    this.jobId = data.jobId;
    this.inCartListedStatusForSearchView = data.inCartStatus;
    this.inRejectListedStatusForSearchView = data.inRejectedStatus;
    this.candidateId = this.candidate._id;
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

  workFlowAction(actionData:any) {
    this.qCardViewService.updateCandidateLists(actionData.jobId, this.candidateId, actionData.name, 'add').subscribe(
      data => {
        this.getJobProfiles(this.candidateId);
      }, error => this.errorService.onError(error)
    );
  }

  actionOnCard(value:string) {
    var data = {'name': value, 'jobId': this.jobId};
    this.workFlowAction(data);
  }

  getImagePath() {
    return ImagePath;
  }

}
