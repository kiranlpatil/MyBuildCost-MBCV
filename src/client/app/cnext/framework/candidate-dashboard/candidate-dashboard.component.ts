import { Component, OnInit } from '@angular/core';
import { CandidateProfileService } from '../candidate-profile/candidate-profile.service';
import { Candidate, Summary } from '../model/candidate';
import { CandidateDashboardService } from './candidate-dashboard.service';
import { JobQcard } from '../model/JobQcard';
import {LocalStorage, ValueConstant, Tooltip, ImagePath, Headings} from '../../../framework/shared/constants';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';
import { CandidateJobListService } from './candidate-job-list/candidate-job-list.service';
import { QCardFilterService } from '../filters/q-card-filter.service';
import { LoaderService } from '../../../framework/shared/loader/loader.service';
import {GuidedTourService} from "../guided-tour.service";
import {ErrorService} from "../error.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-dashboard',
  templateUrl: 'candidate-dashboard.component.html',
  styleUrls: ['candidate-dashboard.component.css']
})

export class CandidateDashboardComponent implements OnInit{
  gotItMessage:string= Headings.GOT_IT;
  private candidate: Candidate = new Candidate();
  private jobList: JobQcard[] = new Array(0);
  private appliedJobs: JobQcard[] = new Array(0);
  private blockedJobs: JobQcard[] = new Array(0);
  private hideSection: boolean = false;
  private locationList: string[] = new Array(0);
  private _locationList: string[] = new Array(0);
  private type: string;
  private emptyDashboardMessage: string = Tooltip.EMPTY_CANDIDATE_DASHBOARD_MESSAGE;
  private noAppliedJobMessage: string = Tooltip.APPLIED_JOB_MESSAGE;
  private noNotIntrestedJobMessage: string = Tooltip.NOT_INTRESTED_JOB_MESSAGE;
  private overlayScreensDashboardImgPath:string;
  private guidedTourStatus:string[] = new Array(0);
  private overlayScreensDashboardImgName:string;
  private typeOfListVisible : string ='matched';

  constructor(private candidateProfileService: CandidateProfileService,
              private candidateDashboardService: CandidateDashboardService,
              private errorService: ErrorService,
              private candidateJobListService: CandidateJobListService,
              private qcardFilterService:QCardFilterService,
              private loaderService: LoaderService,
              private guidedTourService:GuidedTourService) {
    this.candidateProfileService.getCandidateDetails()
      .subscribe(
        candidateData => {
          this.OnCandidateDataSuccess(candidateData);
        },error => this.errorService.onError(error));
  }

  ngOnInit() {
    this.overlayScreensDashboardImgPath = ImagePath.BASE_ASSETS_PATH_DESKTOP + ImagePath.CANDIDATE_OERLAY_SCREENS_DASHBOARD;
    this.overlayScreensDashboardImgName = ImagePath.CANDIDATE_OERLAY_SCREENS_DASHBOARD;
    this.isRequireGuidedTourImg();
  }

  isRequireGuidedTourImg() {
    /*this.guidedTourService.getTourStatus()
      .subscribe(
        (res:any) => { debugger

        },
        error => console.log(error)
      );
*/
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
  }

  tourGuideGotIt() {

    /*this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_OERLAY_SCREENS_DASHBOARD,true)
      .subscribe(
        (res:any) => {

        },
        error => console.log(error)
      );*/
    this.guidedTourStatus = this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_OERLAY_SCREENS_DASHBOARD,true);
  }

  extractList(jobList: JobQcard[]) {
    for (let job of jobList) {
      var addition = job.above_one_step_matching + job.exact_matching;
      if (addition <= ValueConstant.MATCHING_PERCENTAGE) {
        this.jobList.splice(this.jobList.indexOf(job), 1);
      } else {
        if (this.locationList.indexOf(job.location) == -1) {
          this.locationList.push(job.location);
        }
      }
    }
    this.candidate.summary.numberOfmatched=this.jobList.length;
    this._locationList = this.locationList;
  }

  OnCandidateDataSuccess(candidateData: any) {
    this.candidate = candidateData.data[0];
    this.candidate.basicInformation = candidateData.metadata;
    this.candidate.summary = new Summary();
    this.getAppliedJobList();
    this.getMatchedJobList();
    this.getRejectedJobList();
  }

  onActionPerformOnExactList(action: string) {
    for (let job of this.jobList) {
      if (job._id === LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID)) {
        this.jobList.splice(this.jobList.indexOf(job), 1);
      }
    }
    this.candidate.summary.numberOfmatched=this.jobList.length;
    this.onActionPerform(action);
  }

  onActionPerformOnApproxList(action: string) {
    for (let job of this.jobList) {
      if (job._id === LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID)) {
        this.jobList.splice(this.jobList.indexOf(job), 1);
      }
    }
    this.candidate.summary.numberOfmatched=this.jobList.length;
    this.onActionPerform(action);
  }

  onActionPerform(action: string) {
    if (action === 'block') {
      this.candidate.summary.numberJobsBlocked++;
      this.getRejectedJobList();
    }
    else if (action === 'apply') {
      this.candidate.summary.numberOfJobApplied++;
      this.getAppliedJobList();
    }
  }

  onActionOnApplyJob(action: string) {
    this.qcardFilterService.clearFilter();

  }

  onActionOnBlockJob(action: string) {
    if (action === 'delete') {
      this.candidate.summary.numberJobsBlocked--;
      this.getRejectedJobList();
      this.getMatchedJobList();
    }
  }

  showAppliedJobs() {
   /* this.qcardFilterService.clearFilter();*/
   this.typeOfListVisible='applied';
    if(this.appliedJobs.length>0) {
      return;
    }
   this.getAppliedJobList();
  }

  getAppliedJobList() {
    this.candidateJobListService.getAppliedJobList()
      .subscribe(
        data => {
          this.appliedJobs = data.data;
          this.candidate.summary.numberOfJobApplied = this.appliedJobs.length;
        },error => this.errorService.onError(error));
    if( this.candidate.summary.numberOfJobApplied===undefined){
      this.candidate.summary.numberOfJobApplied=0;
    }
  }
  showRejectedJobs() {
   /* this.qcardFilterService.clearFilter();*/
    this.typeOfListVisible='rejected';
    if(this.blockedJobs.length>0) {
      return;
    }
    this.getRejectedJobList();
  }
  getRejectedJobList() {
    this.candidateJobListService.getBlockedJobList()
      .subscribe(
        data => {
          this.blockedJobs = data.data;
          this.candidate.summary.numberJobsBlocked = this.blockedJobs.length;
        },error => this.errorService.onError(error));
    if( this.candidate.summary.numberJobsBlocked===undefined){
      this.candidate.summary.numberJobsBlocked=0;
    }
  }

  showMatchedJobs() {
    this.typeOfListVisible='matched';
    if(this.jobList.length>0) {
      return;
    }
    /*this.qcardFilterService.clearFilter();*/
    this.getMatchedJobList();
  }
  getMatchedJobList(){
    this.candidateDashboardService.getJobList()
      .subscribe(
        data => {
          this.loaderService.stop();
          this.jobList = data;
          this.candidate.summary.numberOfmatched= this.jobList.length;
          this.extractList(this.jobList);
        },error => this.errorService.onError(error));
  }
}
