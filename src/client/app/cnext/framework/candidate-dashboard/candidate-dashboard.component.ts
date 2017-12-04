import {Component, OnInit} from "@angular/core";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Summary} from "../../../user/models/candidate";
import {CandidateDashboardService} from "./candidate-dashboard.service";
import {JobQcard} from "../model/JobQcard";
import {LocalStorage, ValueConstant, Tooltip, ImagePath, Headings, Messages} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {CandidateJobListService} from "./candidate-job-list/candidate-job-list.service";
import {QCardFilterService} from "../filters/q-card-filter.service";
import {LoaderService} from "../../../shared/loader/loaders.service";
import {GuidedTourService} from "../guided-tour.service";
import {ErrorService} from "../../../shared/services/error.service";
import {QCardFilter} from "../model/q-card-filter";
import {EList} from "../model/list-type";
import {ESort} from "../model/sort-type";
import {QCardsortBy} from "../model/q-cardview-sortby";
import {SessionStorageService} from "../../../shared/services/session.service";
import {RecruiterDashboardService} from "../recruiter-dashboard/recruiter-dashboard.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-dashboard',
  templateUrl: 'candidate-dashboard.component.html',
  styleUrls: ['candidate-dashboard.component.css']
})

export class CandidateDashboardComponent implements OnInit {
  gotItMessage: string = Headings.GOT_IT;
  candidate: Candidate = new Candidate();
  listName: EList = EList.JOB_MATCHED;
  sortBy: ESort = ESort.BEST_MATCH;
  private jobList: JobQcard[] = new Array(0);
  private recruitersJobList: JobQcard[] = new Array(0);
  private appliedJobs: JobQcard[] = new Array(0);
  private blockedJobs: JobQcard[] = new Array(0);
  private locationList: string[] = new Array(0);
  private _locationList: string[] = new Array(0);
  private emptyDashboardMessage: string = Tooltip.EMPTY_CANDIDATE_DASHBOARD_MESSAGE;
  private noAppliedJobMessage: string = Tooltip.APPLIED_JOB_MESSAGE;
  private noNotIntrestedJobMessage: string = Tooltip.NOT_INTRESTED_JOB_MESSAGE;
  private overlayScreensDashboardImgPath: string;
  guidedTourStatus: string[] = new Array(0);
  overlayScreensDashboardImgName: string;
  private typeOfListVisible: string = 'matched';
  private appliedFilters: QCardFilter = new QCardFilter();
  private qCardModel: QCardsortBy = new QCardsortBy();
  isRecruiterReferred: boolean = false;
  recruiterReferenceId = SessionStorageService.getRecruiterReferenceId();
  companyName: string = '';

  constructor(private candidateProfileService: CandidateProfileService,
              private candidateDashboardService: CandidateDashboardService,
              private errorService: ErrorService,
              private candidateJobListService: CandidateJobListService,
              private qcardFilterService: QCardFilterService,
              private loaderService: LoaderService,
              private guidedTourService: GuidedTourService,
              private recruiterDashboardService: RecruiterDashboardService) {
    this.candidateProfileService.getCandidateDetails()
      .subscribe(
        candidateData => {
          this.OnCandidateDataSuccess(candidateData);
        }, error => this.errorService.onError(error));
    this.appliedFilters = new QCardFilter();
  }

  ngOnInit() {
    if (this.recruiterReferenceId) {
      this.isRecruiterReferred = true;
      this.typeOfListVisible = 'recruiters';
      this.recruiterDashboardService.getRecruiterDetailsById(this.recruiterReferenceId)
        .subscribe(
          recruiter => {
            this.companyName = recruiter.data.company_name;
          },
          error => this.errorService.onError(error)
        );
    }
    this.overlayScreensDashboardImgPath = ImagePath.BASE_ASSETS_PATH_DESKTOP + ImagePath.CANDIDATE_OERLAY_SCREENS_DASHBOARD;
    this.overlayScreensDashboardImgName = ImagePath.CANDIDATE_OERLAY_SCREENS_DASHBOARD;
    this.isRequireGuidedTourImg();
  }

  isRequireGuidedTourImg() {
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
  }

  tourGuideGotIt() {
    this.guidedTourStatus = this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_OERLAY_SCREENS_DASHBOARD, true);
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
    this.guidedTourService.updateProfileField(this.guidedTourStatus)
      .subscribe(
        (res: any) => {
          LocalStorageService.setLocalValue(LocalStorage.GUIDED_TOUR, JSON.stringify(res.data.guide_tour));
        },
        error => this.errorService.onError(error)
      );

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
    this.candidate.summary.numberOfmatched = this.jobList.length;
    this._locationList = this.locationList;
  }

  extractRecruitersJobList(jobList: JobQcard[]) {
    for (let job of jobList) {
      var addition = job.above_one_step_matching + job.exact_matching;
      if (addition <= ValueConstant.MATCHING_PERCENTAGE) {
        this.recruitersJobList.splice(this.recruitersJobList.indexOf(job), 1);
      }
    }
    this.candidate.summary.numberOfRecruiterJobs = this.recruitersJobList.length;
  }

  OnCandidateDataSuccess(candidateData: any) {
    this.candidate = candidateData.data[0];
    this.candidate.basicInformation = candidateData.metadata;
    this.candidate.summary = new Summary();
    if (this.isRecruiterReferred) {
      this.getRecruitersJobList();
    }
    this.getAppliedJobList();
    this.getMatchedJobList();
    this.getRejectedJobList();
  }

  onActionPerformOnExactList(action: string) {
    for (let job of this.jobList) {
      if (job._id === LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID)) {
        this.jobList.splice(this.jobList.indexOf(job), 1);
        this.recruitersJobList.splice(this.recruitersJobList.indexOf(job), 1);
      }
    }

    this.candidate.summary.numberOfmatched = this.jobList.length;
    this.candidate.summary.numberOfRecruiterJobs = this.recruitersJobList.length;
    this.onActionPerform(action);
  }

  onActionPerformOnApproxList(action: string) {
    for (let job of this.jobList) {
      if (job._id === LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID)) {
        this.jobList.splice(this.jobList.indexOf(job), 1);
      }
    }
    this.candidate.summary.numberOfmatched = this.jobList.length;
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
    this.typeOfListVisible = 'applied';
    if (this.appliedJobs.length > 0) {
      return;
    }
    this.getAppliedJobList();
  }

  getAppliedJobList() {
    this.appliedFilters.listName = EList.JOB_APPLIED;
    this.candidateJobListService.getAppliedJobList(this.appliedFilters)
      .subscribe(
        data => {
          this.appliedJobs = data;
          this.candidate.summary.numberOfJobApplied = this.appliedJobs.length;
        }, error => this.errorService.onError(error));
    if (this.candidate.summary.numberOfJobApplied === undefined) {
      this.candidate.summary.numberOfJobApplied = 0;
    }
  }

  showRejectedJobs() {
    this.typeOfListVisible = 'rejected';
    if (this.blockedJobs.length > 0) {
      return;
    }
    this.getRejectedJobList();
  }

  getRejectedJobList() {
    this.appliedFilters.listName = EList.JOB_NOT_INTERESTED;
    this.candidateJobListService.getBlockedJobList(this.appliedFilters)
      .subscribe(
        data => {
          this.blockedJobs = data;
          this.candidate.summary.numberJobsBlocked = this.blockedJobs.length;
        }, error => this.errorService.onError(error));
    if (this.candidate.summary.numberJobsBlocked === undefined) {
      this.candidate.summary.numberJobsBlocked = 0;
    }
  }

  showMatchedJobs() {
    this.typeOfListVisible = 'matched';
    if (this.jobList.length > 0) {
      return;
    }
    this.getMatchedJobList();
  }

  showRecruitersMatchedJobs() {
    this.typeOfListVisible = 'recruiters';
    if (this.jobList.length > 0) {
      return;
    }
    this.getRecruitersJobList();
  }

  getRecruitersJobList() {
    this.appliedFilters.listName = EList.JOB_MATCHED;
    let updatedAppliedFilters = JSON.parse(JSON.stringify(this.appliedFilters));
    updatedAppliedFilters['recruiterId'] = this.recruiterReferenceId;
    this.candidateDashboardService.getJobList(updatedAppliedFilters)
      .subscribe(
        data => {
          this.loaderService.stop();
          this.recruitersJobList = data;
          this.candidate.summary.numberOfRecruiterJobs = this.recruitersJobList.length;
          this.extractRecruitersJobList(this.recruitersJobList);
        }, error => this.errorService.onError(error));
  }

  getMatchedJobList() {
    this.appliedFilters.listName = EList.JOB_MATCHED;
    this.candidateDashboardService.getJobList(this.appliedFilters)
      .subscribe(
        data => {
          this.loaderService.stop();
          this.jobList = data;
          console.log("Candidate matched job list", this.jobList);
          this.candidate.summary.numberOfmatched = this.jobList.length;
          this.extractList(this.jobList);
        }, error => this.errorService.onError(error));
  }

  getMessage() {
    return Messages;
  }

  changeFilter(obj: QCardFilter) {
    this.appliedFilters = obj;
    if (EList.JOB_APPLIED === this.listName) {
      this.appliedFilters.listName = EList.JOB_APPLIED;
      this.getAppliedJobList();
    } else if (EList.JOB_NOT_INTERESTED === this.listName) {
      this.appliedFilters.listName = EList.JOB_NOT_INTERESTED;
      this.getRejectedJobList();
    } else if (this.typeOfListVisible == 'recruiters') {
      this.appliedFilters.listName = EList.JOB_MATCHED;
      this.getRecruitersJobList();
    } else {
      this.appliedFilters.listName = EList.JOB_MATCHED;
      this.getMatchedJobList();
    }
  }

  onSortChange(value: string) {
    switch (value) {
      case this.qCardModel.listOfMatchings[2]:
        this.appliedFilters.sortBy = ESort.SALARY;
        break;
      case this.qCardModel.listOfMatchings[1]:
        this.appliedFilters.sortBy = ESort.EXPERIENCE;
        break;
      case this.qCardModel.listOfMatchings[0] :
        this.appliedFilters.sortBy = ESort.BEST_MATCH;
        break;
      default :
        this.appliedFilters.sortBy = ESort.BEST_MATCH;
        break;
    }
    this.changeFilter(this.appliedFilters);
  }

}
