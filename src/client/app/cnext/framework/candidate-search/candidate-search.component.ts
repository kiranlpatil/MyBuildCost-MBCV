import {Component, OnChanges} from "@angular/core";
import {CandidateSearchService} from "./candidate-search.service";
import {ErrorService} from "../error.service";
import {CandidateSearch} from "../model/candidate-search";
import {JobQcard} from "../model/JobQcard";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate} from "../model/candidate";
import {CandidateDetail} from "../../../framework/registration/candidate/candidate";
import {Router} from "@angular/router";
import {Messages} from "../../../framework/shared/constants";

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
  //private candidateDataList:string[] = new Array(0);
  private candidateDetails:CandidateDetail = new CandidateDetail();
  private candidate:Candidate = new Candidate();
  private userId:string;
  private msgSearchResultNotFound:string = Messages.MSG_CANDIDATE_SEARCH_NOT_FOUND;
  private msgCandidateNotFound:string = Messages.MSG_CANDIDATE_NOT_FOUND;
  private msgCandidateVisibilityOff:string = Messages.MSG_CNADIDATE_VISIBILITY_OFF;
  private candidateId:string;
  private jobId:string;
  private isShowJobCompareView:boolean = false;

  constructor(private _router:Router, private candidateSearchService:CandidateSearchService, private errorService:ErrorService, private profileCreatorService:CandidateProfileService) {

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
      //this.listOfJobs = new Array(0);
    }
  }

  getJobProfileMatching(item:CandidateSearch) {
    this.searchValue = item.first_name + " " + item.last_name;
    this.getJobProfiles(item.id);
    this.getCandidateProfile(item.id)
  }

  getJobProfiles(candidateId:string) {
    this.candidateSearchService.getJobProfileMatching(candidateId)
      .subscribe(
        (res:any) => {
          this.listOfJobs = res.jobData;
          this.candidateDataList = new Array(0);
        },
        error => this.errorService.onError(error)
      );
  }

  getCandidateProfile(candidateId:string) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidateId)
      .subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData),
        error => this.errorService.onError(error));
  }

  OnCandidateDataSuccess(candidateData:any) {
    this.candidate = candidateData.data;
    this.candidateDetails = candidateData.metadata;
    this.userId = this.candidateDetails._id;
    //this.getSecondaryData();
  }

  viewProfile(nav:string) {
    if (nav !== undefined) {
      this._router.navigate([nav, this.userId]);
    }
  }

  showSearchResult() {
    if (this.candidateDataList.length) {
      this.getJobProfileMatching(this.candidateDataList[0]);
    }
    else {
      this.candidateDetails = new CandidateDetail();
      this.candidate = new Candidate();
      this.listOfJobs = new Array(0);
    }
  }

  showJobCompareView(job:JobQcard) {
    this.jobId = job._id;
    var canId:any = this.candidate._id;
    this.candidateId = canId;
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

}
