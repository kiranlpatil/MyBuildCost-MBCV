import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {JobPosterModel} from "../../../user/models/jobPoster";
import {JobPosterService} from "./job-poster.service";
import {Role} from "../model/role";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Proficiences} from "../model/proficiency";
import {Section} from "../../../user/models/candidate";
import {ShowQcardviewService} from "../showQCard.service";
import {Router} from "@angular/router";
import {Industry} from "../../../user/models/industry";
import {RecruiterDashboardService} from "../recruiter-dashboard/recruiter-dashboard.service";
import {RecruiterDashboard} from "../model/recruiter-dashboard";
import {ErrorService} from "../error.service";
import {Headings, Label, LocalStorage, Messages, ValueConstant} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";

@Component({
  moduleId: module.id,
  selector: 'cn-job-poster',
  templateUrl: 'job-poster.component.html',
  styleUrls: ['job-poster.component.css']
})

export class JobPosterComponent implements OnInit, OnChanges {
  @Input() noOfJobPosted: number;
  @Input() currentjobId: string;
  @Input() recruiter: RecruiterDashboard;
  @Output() jobPostEventEmitter: EventEmitter<string> = new EventEmitter();
  @Output() jobPostCloneSuccessEmitter: EventEmitter<boolean> = new EventEmitter();


  jobPostMessage: string = Messages.MSG_JOB_POST;
  private roleList: string[] = new Array(0);
  private primaryCapability: string[] = new Array(0);
  private proficiencies: Proficiences = new Proficiences();
  private rolesForMain: Role[] = new Array(0);
  private rolesForCapability: Role[] = new Array(0);
  private rolesForComplexity: Role[] = new Array(0);
  private isCandidate: boolean = false;
  private disableButton: boolean = true;
  private isShowCandidateQCardView: boolean = false;
  private setCapabilityMatrix: boolean = true;
  private isShowComplexity: boolean = false;
  private isShowRoleList: boolean = false;
  private isShowIndustryList: boolean = false;
  private isShowCapability: boolean = false;
  private isShowProficiency: boolean = false;
  private showIndustryExposure: boolean = false;
  private showCompentensies: boolean = false;
  private showReleventIndustryList: boolean = false;
  private showModalStyle: boolean = false;
  private isCapabilitypresent: boolean = false;
  private jobPosterModel = new JobPosterModel();
  private jobForComplexity: Role[] = new Array(0);
  private jobForRole: Role[] = new Array(0);
  private jobForCapability: Role[] = new Array(0);
  private jobId: string;
  private isShowReleventIndustryListStep: boolean = false;
  private isPresentCapability: boolean = false;
  private isComplexityFilled: boolean = true;
  private isPresentDefaultcomplexity: boolean = false;
  private flag: boolean = true;
  private highlightedSection: Section = new Section();
  private selectedJobTitle:string;
  private selectedJobId:string;
  private isCloneButtonClicked:boolean;
  constructor(private profileCreatorService: CandidateProfileService,
              private recruiterDashboardService: RecruiterDashboardService,
              private errorService: ErrorService,
              private showQCardView: ShowQcardviewService,
              private jobPostService: JobPosterService,
              private _router: Router) {
  }

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }

  ngOnChanges(changes: any) {
    if (changes.currentjobId !== undefined && changes.currentjobId.currentValue !== undefined) {
      this.jobId = changes.currentjobId.currentValue;
      this.getJobProfile();
    } else if((changes.recruiter==undefined )|| (changes.currentjobId !== undefined )) {
      this.jobPosterModel = new JobPosterModel();
      this.highlightedSection.name = 'JobProfile';
    }
  }

  getJobProfile() {
    this.recruiterDashboardService.getPostedJobDetails(this.jobId)
      .subscribe(
        data => {
          this.jobPosterModel = data.data.industry.postedJobs[0];
          this.onGetJobDetailsSuccess(this.jobPosterModel);
        }, error => this.errorService.onError(error));
  }

  onGetJobDetailsSuccess(jobmodel: JobPosterModel) {
    LocalStorageService.setLocalValue(LocalStorage.POSTED_JOB, jobmodel._id);
    this.isShowIndustryList = true;
    if (jobmodel.industry && jobmodel.industry.name !== '') {
      this.getRoles();
      this.isShowRoleList = true;
      this.jobForRole = this.jobPosterModel.industry.roles;
      this.jobForCapability = this.jobPosterModel.industry.roles;
      if (jobmodel.industry.roles && jobmodel.industry.roles.length > 0) {
        this.jobForCapability = this.jobPosterModel.industry.roles;
        this.jobForComplexity = this.jobPosterModel.industry.roles;
        this.rolesForCapability = new Array(0);
        if (this.flag) {
          this.getCapability();
          this.isShowCapability = true;
          for (let role of jobmodel.industry.roles) {
            if (role.default_complexities[0] !== undefined && role.default_complexities[0].complexities.length > 0) {
              this.isPresentDefaultcomplexity = true;
            }
            if (role.capabilities !== undefined && role.capabilities.length > 0) {
              this.isPresentCapability = true;
            }
          }
        }
        if (this.isPresentCapability || this.isPresentDefaultcomplexity) {
          this.isShowComplexity = true;
          this.jobForCapability = this.jobPosterModel.industry.roles;
          this.jobForRole = this.jobPosterModel.industry.roles;
          this.jobForComplexity = this.jobPosterModel.industry.roles;
          this.getComplexity();
          this.setCapabilityMatrix = true;
          if (jobmodel.capability_matrix) {
            let capbilityMatrix: any = Object.keys(jobmodel.capability_matrix);
            for (let index of capbilityMatrix) {
              if (jobmodel.capability_matrix[index] === -1) {
                this.isComplexityFilled = false;
              }
            }
          }
          if (this.isComplexityFilled) {
            this.getProficiency();
            this.isShowProficiency = true;
            if (jobmodel.proficiencies !== undefined && jobmodel.proficiencies.length > 0) {
              this.showIndustryExposure = true;
              if (jobmodel.interestedIndustries !== undefined && jobmodel.interestedIndustries.length > 0) {
                this.showReleventIndustryList = true;
                this.showCompentensies = true;
                this.highlightedSection.name = 'None';
              } else {
                this.highlightedSection.name = 'IndustryExposure';
              }
            } else {
              this.highlightedSection.name = 'Proficiencies';
            }
          } else {
            this.highlightedSection.name = 'Complexities';
          }
        } else {
          this.highlightedSection.name = 'Capabilities';
        }
      } else {
        this.highlightedSection.name = 'Work-Area';
      }
    } else {
      this.highlightedSection.name = 'Industry';
    }
  }

  postjob() {
    this.showModalStyle = !this.showModalStyle;
    this.jobPosterModel.isJobPosted = true;
    this.jobPosterModel.postingDate = new Date();
    this.jobPosterModel.expiringDate = new Date((new Date().getTime() + ValueConstant.JOB__EXPIRIY_PERIOD));
    this.jobPostService.postJob(this.jobPosterModel).subscribe(
      data => {
        this.onSuccess(data.data.postedJobs[0]._id);
      }, error => this.errorService.onError(error));
  }

  updateJob() {
    this.jobPosterModel.postingDate = new Date();
    this.jobPosterModel.expiringDate = new Date((new Date().getTime() + ValueConstant.JOB__EXPIRIY_PERIOD));
    this.jobPostService.postJob(this.jobPosterModel).subscribe(
      data => {
        this.jobPosterModel._id = data.data.postedJobs[0]._id;
        LocalStorageService.setLocalValue(LocalStorage.POSTED_JOB, this.jobPosterModel._id);
        if (this.setCapabilityMatrix) {
          this.jobPosterModel.capability_matrix = data.data.postedJobs[0].capability_matrix;
          this.setCapabilityMatrix = false;
        }
      }, error => this.errorService.onError(error));
  }

  onSuccess(jobId: string) {
    if (jobId !== undefined) {
      LocalStorageService.setLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID, jobId);
      this._router.navigate(['jobdashboard/', jobId]);
    }
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  closeJob() {
    this.showModalStyle = !this.showModalStyle;
  }

  mockupSearch() {
    this.isShowCandidateQCardView = true;
    this.showQCardView.change(this.jobPosterModel);
  }

  onBasicJobInformationComplete(jobModel: JobPosterModel) {
    this.jobPosterModel.department = jobModel.department;
    this.jobPosterModel.education = jobModel.education;
    this.jobPosterModel.experienceMaxValue = jobModel.experienceMaxValue;
    this.jobPosterModel.experienceMinValue = jobModel.experienceMinValue;
    this.jobPosterModel.hiringManager = jobModel.hiringManager;
    this.jobPosterModel.jobTitle = jobModel.jobTitle;
    this.jobPosterModel.joiningPeriod = jobModel.joiningPeriod;
    this.jobPosterModel.location = jobModel.location;
    this.jobPosterModel.salaryMaxValue = jobModel.salaryMaxValue;
    this.jobPosterModel.salaryMinValue = jobModel.salaryMinValue;
    this.isShowIndustryList = true;
    this.jobPosterModel.hideCompanyName = jobModel.hideCompanyName;
    this.updateJob();
  }

  selectIndustry(industry: Industry) {
    if (this.jobPosterModel.industry.name !== industry.name) {
      this.jobPosterModel.industry = industry;
      this.jobPosterModel.industry.roles = [];
    }
    this.getRoles();
    this.isShowRoleList = true;
    this.jobForRole = this.jobPosterModel.industry.roles;
    this.jobForCapability = this.jobPosterModel.industry.roles;
    this.updateJob();
  }

  selectRole(roles: Role[]) {
    this.jobPosterModel.industry.roles = roles;
    this.jobForCapability = this.jobPosterModel.industry.roles;
    this.jobForComplexity = this.jobPosterModel.industry.roles;
    this.rolesForCapability = new Array(0);
    if (this.flag) {
      this.getCapability();
      this.isShowCapability = true;
    }
    this.updateJob();
  }

  selectCapability(roles: Role[]) {
    this.jobPosterModel.industry.roles = roles;
    this.jobForCapability = this.jobPosterModel.industry.roles;
    this.jobForRole = this.jobPosterModel.industry.roles;
    this.jobForComplexity = this.jobPosterModel.industry.roles;
    this.updateJob();
    this.getComplexity();
    this.setCapabilityMatrix = true;
  }

  onComplextyAnswered(capability_matrix: any) {
    this.jobPosterModel.capability_matrix = capability_matrix;
    this.updateJob();
  }

  selectRoleFromComplexity() {
    this.updateJob();
    this.getProficiency();
    this.isShowProficiency = true;
  }

  selectProficiency(jobModel: JobPosterModel) {
    if (jobModel.proficiencies !== undefined) {
      this.jobPosterModel.proficiencies = jobModel.proficiencies;
    }
    if (jobModel.additionalProficiencies !== undefined) {
      this.jobPosterModel.additionalProficiencies = jobModel.additionalProficiencies;
    }
    this.updateJob();
  }

  onProficiencyComplete() {
    this.showIndustryExposure = true;
  }

  selectExperiencedIndustry(experiencedindustry: string[]) {
    this.jobPosterModel.interestedIndustries = experiencedindustry;
    this.updateJob();
  }

  onIndustryExposureComplete() {
    if (this.isShowReleventIndustryListStep) {
      this.highlightedSection.name = 'ReleventIndustry';
      this.showReleventIndustryList = true;
    } else {
      this.highlightedSection.name = 'Compentancies';
      this.showCompentensies = true;
    }
  }

  onCompentansiesandResponsibilitycomplete(data: any) {
    this.jobPosterModel = data;
    if (this.jobPosterModel.competencies !== undefined && this.jobPosterModel.competencies !== '') {
      this.disableButton = false;
    }
    this.updateJob();
  }

  getRoles() {
    if (this.jobPosterModel.industry.name !== undefined) {
      this.profileCreatorService.getRoles(this.jobPosterModel.industry.code)
        .subscribe(
          rolelist => this.rolesForMain = rolelist.data,
          error => this.errorService.onError(error));
    }
  }

  getCapability() {
    this.primaryCapability = [];
    this.roleList = new Array(0);
    for (let role of this.jobPosterModel.industry.roles) {
      this.roleList.push(role.code);
    }
    if (this.jobPosterModel.industry.name !== undefined && this.roleList !== undefined) {
      this.profileCreatorService.getCapability(this.jobPosterModel.industry.code, this.roleList)
        .subscribe(
          rolelist => {
            this.rolesForCapability = rolelist.data;
            for (let role of this.rolesForCapability) {
              if (role.capabilities !== undefined) {
                if (role.capabilities.length > 0) {
                  this.isCapabilitypresent = true;
                }
              }
            }
            if (this.isCapabilitypresent === false) {
              this.isShowCapability = false;
              this.isShowComplexity = true;
              this.getComplexity();
            }
            this.isCapabilitypresent = false;
            this.getJobForCapability();
          }, error => this.errorService.onError(error));
    }
  }

  getJobForCapability() {
    this.jobForCapability = this.jobPosterModel.industry.roles;
  }

  getComplexity() {
    this.primaryCapability = [];
    for (let role of this.jobPosterModel.industry.roles) {
      if (role.capabilities) {
        for (let capability of role.capabilities) {
          if (capability.isPrimary) {
            this.primaryCapability.push(capability.code);
          }
        }
      }
    }
    if (this.jobPosterModel.industry.name !== undefined && this.roleList !== undefined) {
      this.profileCreatorService.getComplexity(this.jobPosterModel.industry.code, this.roleList, this.primaryCapability)
        .subscribe(
          rolelist => {
            this.rolesForComplexity = rolelist.data;
            //this.highlightedSection.name = 'Complexities';
            this.getJobForComplexity();
          }, error => this.errorService.onError(error));
    }
  }

  getProficiency() {
    this.profileCreatorService.getProficiency()
      .subscribe(
        data => {
          this.proficiencies = data.data[0].proficiencies;
        }, error => this.errorService.onError(error));
  }

  getJobForComplexity() {
    this.isShowComplexity = true;
  }

  onReleventIndustryComplete(value: any) {
    this.jobPosterModel.releventIndustries = value;
    this.showCompentensies = true;
    this.updateJob();
  }

  checkReleventIndustries(value: any) {
    (value > 0) ? this.isShowReleventIndustryListStep = true : this.isShowReleventIndustryListStep = false;
  }

  raiseCloneEvent() {
    this.selectedJobTitle= this.jobPosterModel.jobTitle;
    this.selectedJobId= this.jobPosterModel._id;
    this.isCloneButtonClicked=!this.isCloneButtonClicked;

  }

  onJobCloned(event:any) {
    this.jobPostEventEmitter.emit(event);
    this.jobPostCloneSuccessEmitter.emit();
  }

  getHeading() {
    return Headings;
  }

  getLabel() {
    return Label;
  }
}
