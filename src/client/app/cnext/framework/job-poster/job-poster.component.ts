import {Component} from "@angular/core";
import {ShowJobFilterService} from "../showJobFilter.service";
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


  constructor(private profileCreatorService:CandidateProfileService,
              private messageService:MessageService,
              private showJobFilter:ShowJobFilterService,
              private jobPostService:JobPosterService) {

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
    this.jobPosterModel.postingDate = (new Date()).toISOString();
    this.jobPostService.postJob(this.jobPosterModel).subscribe(
      user => {
        console.log(user);
      });
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
    this.showJobFilter.change(true);

  }

  selectExperiencedIndustry(experiencedindustry:string[]) {
    this.jobPosterModel.interestedIndustry = experiencedindustry;
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

  selectProficiency(proficiency:string[]) {
    this.jobPosterModel.profiencies = proficiency;
    this.jobPosterModel.interestedIndustry = proficiency;
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
    this.profileCreatorService.getRoles(this.jobPosterModel.industry.name)
      .subscribe(
        rolelist => this.rolesForMain = rolelist.data,
        error => this.onError(error));
  }

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
    this.profileCreatorService.getProficiency(this.jobPosterModel.industry.name)
      .subscribe(
        data => this.proficiencies = data.data,
        error => this.onError(error));
  }
}
