import {Component} from "@angular/core";
import {JobPosterModel} from "../model/jobPoster";
import {JobPosterService} from "./job-poster.service";
import {Role} from "../model/role";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Message} from "../../../framework/shared/message";
import {MessageService} from "../../../framework/shared/message.service";
import {Proficiences} from "../model/proficiency";
import {Section} from "../model/candidate";
import {LocalStorage, NavigationRoutes} from "../../../framework/shared/constants";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {ShowQcardviewService} from "../showQCard.service";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'cn-job-poster',
  templateUrl: 'job-poster.component.html',
  styleUrls: ['job-poster.component.css']
})

export class JobPosterComponent {
  private roleList:string[] = new Array(0);
  private primaryCapability:string[] = new Array(0);
  private proficiencies:Proficiences = new Proficiences();
  private rolesForMain:Role[] = new Array(0);
  private rolesForCapability:Role[] = new Array(0);
  private rolesForComplexity:Role[] = new Array(0);
  private isCandidate:boolean = false;
  private disableButton:boolean = true;
  private isShowCandidateQCardView:boolean = false;
  private isShowComplexity:boolean = false;
  private isShowRoleList:boolean = false;
  private isShowRoletype:boolean = false;
  private isShowCapability:boolean = false;
  private isShowProficiency:boolean = false;
  private showModalStyle:boolean = false;
  private jobPosterModel = new JobPosterModel();
  private jobForComplexity:Role[] = new Array(0);
  private flag:boolean = true;
  private highlightedSection:Section = new Section();
  private address :any;
  private country : any;
  private state :any;

  constructor(private profileCreatorService:CandidateProfileService,
              private messageService:MessageService,
              private showQCardView:ShowQcardviewService,
              private jobPostService:JobPosterService, private _router:Router) {


  }

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
    if (this.isCandidate != true) {
      this.highlightedSection.name = "JobProfile";
    }
  }

  postjob() {
    this.showModalStyle = !this.showModalStyle;
    this.jobPosterModel.postingDate =  new Date();;
    this.jobPostService.postJob(this.jobPosterModel).subscribe(
      data => {
        this.onSuccess(data.data.postedJobs[0]._id);
      });
  }

  onSuccess(jobId:string) {
    if(jobId != undefined){
      LocalStorageService.setLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID, jobId);
      this._router.navigate([NavigationRoutes.APP_JOB_SUMMURY]);
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

  mockupSearch() {
    this.isShowCandidateQCardView=true;
    this.showQCardView.change(this.jobPosterModel);


  }

  selectExperiencedIndustry(experiencedindustry:string[]) {
    this.jobPosterModel.interestedIndustries = experiencedindustry;
  }


  onBasicJobInformationComplete(jobModel:JobPosterModel) {
    this.jobPosterModel = jobModel;
    this.getRoles();
    this.getProficiency();
    this.isShowRoleList = true;
  }


  selectRole(roles:Role[]) {
    this.jobPosterModel.industry.roles = roles;
    if (this.flag) {
      this.getCapability();
      this.isShowCapability = true;
    }
    this.isShowRoletype = true;
    if (this.jobPosterModel.industry.roles) {
      if (this.jobPosterModel.industry.roles[0].capabilities) {
        if (this.jobPosterModel.industry.roles[0].capabilities.length > 0) {
          this.getComplexity();
          this.isShowComplexity = true;
        }
      }
    }
  }

  selectRoleFromComplexity(roles:Role[]) {
    this.jobPosterModel.industry.roles = roles;
    this.jobForComplexity = roles;
    this.isShowProficiency = true;
  }

  selectProficiency(jobModel:JobPosterModel) {
    if(jobModel.proficiencies!=undefined ){
      this.jobPosterModel.proficiencies = jobModel.proficiencies;
    }
    if(jobModel.additionalProficiencies!=undefined ){
      this.jobPosterModel.additionalProficiencies = jobModel.additionalProficiencies;
    }
  }

  onCompentansiesandResponsibilitycomplete(data:any) {
    this.jobPosterModel = data;
    if (this.jobPosterModel.competencies != undefined && this.jobPosterModel.competencies != '' &&
      this.jobPosterModel.responsibility != undefined && this.jobPosterModel.responsibility != '') {
      this.disableButton = false;
    }
  }

  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  getRoles() {
    if(this.jobPosterModel.industry.name !== undefined){
    this.profileCreatorService.getRoles(this.jobPosterModel.industry.name)
      .subscribe(
        rolelist => this.rolesForMain = rolelist.data,
        error => this.onError(error));
  }}

  getCapability() {
    this.flag = false;
    for (let role of this.jobPosterModel.industry.roles) {
      this.roleList.push(role.name);
    }
    if (this.jobPosterModel.industry.name != undefined && this.roleList != undefined) {
      this.profileCreatorService.getCapability(this.jobPosterModel.industry.name, this.roleList)
        .subscribe(
          rolelist => {
            this.rolesForCapability = rolelist.data
          },
          error => this.onError(error));
    }
  }

  getComplexity() {
    for (let role of this.jobPosterModel.industry.roles) {
      for (let capability of role.capabilities) {
        if (capability.isPrimary) {
          this.primaryCapability.push(capability.name);
        }
      }
    }
    if (this.jobPosterModel.industry.name != undefined && this.roleList != undefined) {
      this.profileCreatorService.getComplexity(this.jobPosterModel.industry.name, this.roleList, this.primaryCapability)
        .subscribe(
          rolelist => {
            this.rolesForComplexity = rolelist.data;
            this.jobForComplexity = this.jobPosterModel.industry.roles;
          });
    }
  }

  getProficiency() {
    this.profileCreatorService.getProficiency()
      .subscribe(
        data => {
          this.proficiencies = data.data[0].proficiencies;
          console.log(this.proficiencies);
        },
        error => this.onError(error));
  }
}
