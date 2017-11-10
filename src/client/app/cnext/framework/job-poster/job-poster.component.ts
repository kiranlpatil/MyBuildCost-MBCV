import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {JobPosterModel} from "../../../user/models/jobPoster";
import {JobPosterService} from "./job-poster.service";
import {Role} from "../model/role";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Proficiences} from "../model/proficiency";
import {Section} from "../../../user/models/candidate";
import {ShowQcardviewService} from "../showQCard.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Industry} from "../../../user/models/industry";
import {RecruiterDashboardService} from "../recruiter-dashboard/recruiter-dashboard.service";
import {RecruiterDashboard} from "../model/recruiter-dashboard";
import { ErrorService } from '../../../shared/services/error.service';
import {AppSettings,Headings, Label, LocalStorage, Messages, ValueConstant} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {Share} from "../model/share";
import {ShareService} from "../share/share.service";
import {Message} from "../../../shared/models/message";
import {MessageService} from "../../../shared/services/message.service";
import {JobShareContainerService} from "../job-share-container/job-share-container.service";

@Component({
  moduleId: module.id,
  selector: 'cn-job-poster',
  templateUrl: 'job-poster.component.html',
  styleUrls: ['job-poster.component.css']
})

export class JobPosterComponent implements OnInit, OnChanges {
  @Input() noOfJobPosted: number;
  @Input() currentjobId: string;
  @Input() role: string = 'recruiter';
  @Output() jobPostEventEmitter: EventEmitter<string> = new EventEmitter();
  @Output() jobPostCloneSuccessEmitter: EventEmitter<boolean> = new EventEmitter();


  jobPostMessage: string = Messages.MSG_JOB_POST;
  private roleList: string[] = new Array(0);
  private primaryCapability: string[] = new Array(0);
  proficiencies: Proficiences = new Proficiences();
  rolesForMain: Role[] = new Array(0);
  rolesForCapability: Role[] = new Array(0);
  rolesForComplexity: Role[] = new Array(0);
  private isCandidate: boolean = false;
  private disableButton: boolean = true;
  private isShowCandidateQCardView: boolean = false;
  private setCapabilityMatrix: boolean = true;
  private setComplexityMustHaveMatrix: boolean = true;
  isShowComplexity: boolean = false;
  isShowRoleList: boolean = false;
  isShowIndustryList: boolean = false;
  isShowCapability: boolean = false;
  isShowProficiency: boolean = false;
  private showIndustryExposure: boolean = false;
  showCompentensies: boolean = false;
  showReleventIndustryList: boolean = false;
  private showModalStyle: boolean = false;
  private isCapabilitypresent: boolean = false;
  jobPosterModel = new JobPosterModel();
  private jobForComplexity: Role[] = new Array(0);
  jobForRole: Role[] = new Array(0);
  jobForCapability: Role[] = new Array(0);
  jobId: string;
  isShowReleventIndustryListStep: boolean = false;
  private isPresentCapability: boolean = false;
  private isComplexityFilled: boolean = true;
  private isPresentDefaultcomplexity: boolean = false;
  private flag: boolean = true;
  isRecruitingForSelf: boolean= (LocalStorageService.getLocalValue(LocalStorage.IS_RECRUITING_FOR_SELF) == 'true');
  highlightedSection: Section = new Section();
  private selectedJobTitle:string;
  private selectedJobId:string;
  private isCloneButtonClicked:boolean;
  private share=new Share();
  constructor(private profileCreatorService: CandidateProfileService,
              private shareService:ShareService,
              private jobshareContainerService:JobShareContainerService,
              private messageService: MessageService,
              private recruiterDashboardService: RecruiterDashboardService,
              private errorService: ErrorService,
              private showQCardView: ShowQcardviewService,
              private jobPostService: JobPosterService,
              private _router: Router,
              private activatedRoute:ActivatedRoute) {
  }

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
    this.activatedRoute.params.subscribe(params => {
      this.jobId = params['jobId'];
      if(this.jobId) {
        this.getJobProfile();
      } else {
        this.jobPosterModel = new JobPosterModel();
        this.highlightedSection.name = 'JobProfile';
      }
    });
  }

  ngOnChanges(changes: any) {
    if (changes.currentjobId !== undefined && changes.currentjobId.currentValue !== undefined) {
      this.jobId = changes.currentjobId.currentValue;
      this.getJobProfile();
    } else if(changes.currentjobId !== undefined ) {
      this.jobPosterModel = new JobPosterModel();
      this.highlightedSection.name = 'JobProfile';
    }
  }

  getJobProfile() {
    this.recruiterDashboardService.getPostedJobDetails(this.jobId)
      .subscribe(
        data => {
          this.isRecruitingForSelf=data.data.industry.isRecruitingForself;
          this.jobPosterModel = data.data.industry.postedJobs[0];
          if(this.jobPosterModel.complexity_musthave_matrix == undefined) {
            this.jobPosterModel.complexity_musthave_matrix = {};
          }
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
          this.setComplexityMustHaveMatrix = true;
          if (jobmodel.complexity_musthave_matrix) {
            let complexityMustHaveMatrix: any = Object.keys(jobmodel.complexity_musthave_matrix);
            for (let index of complexityMustHaveMatrix) {
              if (jobmodel.complexity_musthave_matrix[index] === -1) {
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
    this.jobPosterModel.expiringDate = new Date((new Date().getTime() + ValueConstant.JOB__EXPIRIY_PERIOD * 6));
    this.jobPostService.postJob(this.jobPosterModel).subscribe(
      data => {
        this.onSuccess(data.data.postedJobs[0]);
      }, error => this.errorService.onError(error));
  }

  updateJob() {
    this.jobPosterModel.postingDate = new Date();
    this.jobPosterModel.expiringDate = new Date((new Date().getTime() + ValueConstant.JOB__EXPIRIY_PERIOD));
    this.jobPosterModel.daysRemainingForExpiring = ValueConstant.JOB__EXPIRIY_PERIOD;
    this.jobPosterModel.isJobPostExpired = false;
    this.jobPostService.postJob(this.jobPosterModel).subscribe(
      data => {
        this.jobPosterModel._id = data.data.postedJobs[0]._id;
        this.jobId=data.data.postedJobs[0]._id;
        LocalStorageService.setLocalValue(LocalStorage.POSTED_JOB, this.jobPosterModel._id);
        if (this.setCapabilityMatrix) {
          this.jobPosterModel.capability_matrix = data.data.postedJobs[0].capability_matrix;
          this.setCapabilityMatrix = false;
        }
        if (this.setComplexityMustHaveMatrix) {
          this.jobPosterModel.complexity_musthave_matrix = data.data.postedJobs[0].complexity_musthave_matrix;
          this.setComplexityMustHaveMatrix = false;
        }
        this._router.navigate(['/recruiter/jobpost', this.jobPosterModel._id]);
      }, error => this.errorService.onError(error));
  }

  onSuccess(jobModel: JobPosterModel) {
    if (jobModel._id !== undefined) {
      if(jobModel.isJobShared) {
        this.jobshareContainerService.updateUrl(jobModel.sharedLink.split('/')[4]).subscribe(
          data => {
            console.log('data',data);
          }, error => this.errorService.onError(error));
      }
      LocalStorageService.setLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID, jobModel._id);
      this._router.navigate(['recruiter/job/', jobModel._id]);
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
  sendMailToRecruiter() {
    this.jobPostService.sendMailToRecruiter(this.jobPosterModel)
      .subscribe(
        res => {
          this.messageService.message(new Message(Messages.MSG_SUCCESS_FOR_HIRING_MANAGER_JOB_CREATION_STATUS));
          window.localStorage.clear();
          setTimeout(() => {
            let host = AppSettings.HTTP_CLIENT + AppSettings.HOST_NAME;
            window.location.href = host;
            }, 5002);
        },
        error => (this.errorService.onError(error)));
  }

  buildJobShareUrl() {
   if(this.jobPosterModel && this.jobPosterModel._id) {
     if(!this.jobPosterModel.isJobShared) {
       this.shareService.buildJobShareUrl(this.jobPosterModel._id)
         .subscribe(
           (data: Share) => {
             this.share = data;
             this.jobPosterModel.sharedLink = data.shareUrl;
             this.jobPosterModel.isJobShared = true;
             this.updateJob();
             if (this.jobPosterModel.sharedLink) {
               //document.getElementById('mail_link').click();
               // let link='<a href='+this.sharedLink+'>JOB EDIT</a>';
               window.location.href = 'mailto:user@example.com?subject=Subject&body=' + this.jobPosterModel.sharedLink;
             }
             console.log('data', data);
           },
           error => {
             this.errorService.onError(error);
           }
         );
     }
   }else {
     console.log('You havent created job yet');
   }
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
    this.setComplexityMustHaveMatrix = true;
  }

  onComplextyAnswered(capability_matrix: any) {
    this.jobPosterModel.capability_matrix = capability_matrix;
    this.updateJob();
  }

  onMustHave(mustHaveMatrix: any) {
    this.jobPosterModel.complexity_musthave_matrix = mustHaveMatrix;
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

  onJobCloned(id:any) {
    //this.jobPostEventEmitter.emit(event);
    this._router.navigate(['/recruiter/jobpost', id]);
    this.jobPostCloneSuccessEmitter.emit();
  }

  getHeading() {
    return Headings;
  }

  getLabel() {
    return Label;
  }

  getMessage() {
      return Messages;
  }
}
