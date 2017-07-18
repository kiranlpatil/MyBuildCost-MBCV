import {Component, Input, OnInit} from "@angular/core";
import {JobPosterModel} from "../model/jobPoster";
import {JobPosterService} from "./job-poster.service";
import {Role} from "../model/role";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Message} from "../../../framework/shared/message";
import {MessageService} from "../../../framework/shared/message.service";
import {Proficiences} from "../model/proficiency";
import {Section} from "../model/candidate";
import {LocalStorage} from "../../../framework/shared/constants";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {ShowQcardviewService} from "../showQCard.service";
import {Router} from "@angular/router";
import {Industry} from "../model/industry";

@Component({
  moduleId: module.id,
  selector: 'cn-job-poster',
  templateUrl: 'job-poster.component.html',
  styleUrls: ['job-poster.component.css']
})

export class JobPosterComponent implements OnInit {
  @Input() noOfJobPosted:number;
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
  private jobForRole: Role[]= new Array(0);
  private jobForCapability: Role[]= new Array(0);
  private isShowReleventIndustryListStep :boolean = false;

  private flag: boolean = true;
  private highlightedSection: Section = new Section();
  constructor(private profileCreatorService: CandidateProfileService,
              private messageService: MessageService,
              private showQCardView: ShowQcardviewService,
              private jobPostService: JobPosterService, private _router: Router) {


  }

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
     }
    if (this.isCandidate !== true) {
      this.highlightedSection.name = 'JobProfile';
    }
  }

  postjob() {
    this.showModalStyle = !this.showModalStyle;
    this.jobPosterModel.isJobPosted = true;
    this.jobPosterModel.postingDate = new Date();
    let expiringDateInSeconds = new Date().getTime() + 2592000000;
    this.jobPosterModel.expiringDate = new Date(expiringDateInSeconds);
    this.jobPostService.postJob(this.jobPosterModel).subscribe(
      data => {
        this.onSuccess(data.data.postedJobs[0]._id);
      });
  }

  updateJob() {
    this.jobPosterModel.postingDate = new Date();
    let expiringDateInSeconds = new Date().getTime() + 2592000000;
    this.jobPosterModel.expiringDate = new Date(expiringDateInSeconds);
    this.jobPostService.postJob(this.jobPosterModel).subscribe(
      data => {
        this.jobPosterModel._id = data.data.postedJobs[0]._id;
        LocalStorageService.setLocalValue(LocalStorage.POSTED_JOB,this.jobPosterModel._id);
        if (this.setCapabilityMatrix) {
          this.jobPosterModel.capability_matrix = data.data.postedJobs[0].capability_matrix;
            this.setCapabilityMatrix = false;
        }
        console.log(this.jobPosterModel.capability_matrix);
      });
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
    this.jobPosterModel.salaryMaxValue= jobModel.salaryMaxValue;
    this.jobPosterModel.salaryMinValue= jobModel.salaryMinValue;
    this.isShowIndustryList = true;
    this.updateJob();
  }

  selectIndustry(industry: Industry) {
    if (this.jobPosterModel.industry.name !== industry.name) {
      this.jobPosterModel.industry = industry;
      this.jobPosterModel.industry.roles = [];
      //this.highlightedSection.name = 'Industry';
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
    this.jobPosterModel.capability_matrix=capability_matrix;
    this.updateJob();
  }
  selectRoleFromComplexity(roles: Role[]) {
    this.updateJob();
    this.getProficiency();
    this.isShowProficiency = true;
  }

  selectProficiency(jobModel: JobPosterModel) {
    if (jobModel.proficiencies != undefined) {
      this.jobPosterModel.proficiencies = jobModel.proficiencies;
    }
    if (jobModel.additionalProficiencies != undefined) {
      this.jobPosterModel.additionalProficiencies = jobModel.additionalProficiencies;
    }
    this.updateJob();
  }

  onProficiencyComplete(event: any) {
    this.showIndustryExposure = true;
  }

  selectExperiencedIndustry(experiencedindustry: string[]) {
    //this.showCompentensies = true;
    this.jobPosterModel.interestedIndustries = experiencedindustry;
    this.updateJob();
  }
  onIndustryExposureComplete(event: any) {
    //this.showCompentensies = true;
    if(this.isShowReleventIndustryListStep) {
      this.highlightedSection.name = 'ReleventIndustry';
      this.showReleventIndustryList = true;
      /*var rolesForRelevent: Role[] = new Array(0);
      rolesForRelevent = this.jobForRole;
      this.rolesForRelevent = rolesForRelevent;*/
    } else {
      this.showCompentensies = true;
      this.highlightedSection.name = 'Compentancies';
    }

  }

  onCompentansiesandResponsibilitycomplete(data: any) {
    this.jobPosterModel = data;
    if (this.jobPosterModel.competencies != undefined && this.jobPosterModel.competencies !== ''  ) {
      this.disableButton = false;
    }
    this.updateJob();
  }

  onError(error: any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  getRoles() {
    if (this.jobPosterModel.industry.name !== undefined) {
      this.profileCreatorService.getRoles(this.jobPosterModel.industry.name)
        .subscribe(
          rolelist => this.rolesForMain = rolelist.data,
          error => this.onError(error));
    }
  }

  getCapability() {
    this.primaryCapability = [];
   // this.flag = false;
    this.roleList=new Array(0);
    for (let role of this.jobPosterModel.industry.roles) {
      this.roleList.push(role.name);
    }
    if (this.jobPosterModel.industry.name != undefined && this.roleList != undefined) {
      this.profileCreatorService.getCapability(this.jobPosterModel.industry.name, this.roleList)
        .subscribe(
          rolelist => {
            this.rolesForCapability = rolelist.data;
            for (let role of this.rolesForCapability) {
              if (role.capabilities != undefined) {
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
          },
          error => this.onError(error));
    }
  }

  getJobForCapability() {
    this.jobForCapability=this.jobPosterModel.industry.roles;
  }
  getComplexity() {
    this.primaryCapability = [];
    for (let role of this.jobPosterModel.industry.roles) {
      if (role.capabilities) {
        for (let capability of role.capabilities) {
          if (capability.isPrimary) {
            this.primaryCapability.push(capability.name);
          }
        }
      }
    }
    if (this.jobPosterModel.industry.name != undefined && this.roleList != undefined) {
      this.profileCreatorService.getComplexity(this.jobPosterModel.industry.name, this.roleList, this.primaryCapability)
        .subscribe(
          rolelist => {
            this.rolesForComplexity = rolelist.data;
            this.highlightedSection.name = 'Complexities';
            this.getJobForComplexity();
          });
    }
  }

  getProficiency() {
    this.profileCreatorService.getProficiency()
      .subscribe(
        data => {
          this.proficiencies = data.data[0].proficiencies;
        },
        error => this.onError(error));
  }

  getJobForComplexity() {
    this.isShowComplexity = true;
  }
  onReleventIndustryComplete(value:any) {
    console.log('----data------',value);
    this.jobPosterModel.releventIndustries = value;
    console.log('---- this.jobPosterModel.releventIndustries------', this.jobPosterModel.releventIndustries);
    this.showCompentensies = true;
    this.updateJob();
  }
  checkReleventIndustries(value:any) {
    (value > 0)?this.isShowReleventIndustryListStep = true:this.isShowReleventIndustryListStep = false;
  }

}
