import {Component} from "@angular/core";
import {JobInformation} from "../model/job-information";
import {JobRequirement} from "../model/job-requirement";
import {JobLocation} from "../model/job-location";
import {MyJobLocationService} from "../myjob-location.service";
import {MyJobPostRoleTypeService} from "../jobpost-roletype.service";
import {JonPostDescriptionService} from "../job-post-description.service";
import {JobPostComplexityService} from "../job-post-complexity.service";
import {Description} from "../model/description";
import {JobPostProficiencyService} from "../jobPostProficiency.service";
import {MyJobInformationService} from "../myJobInformation.service";
import {JobRequirementService} from "../myJobRequirement.service";
import {JobIndustryShowService} from "../myJobIndustryShow.service";
import {DisableTestService} from "../disable-service";
import {ComplexityService} from "../complexity.service";
import {ProficiencyService} from "../proficience.service";
import {MyRoTypeTestService} from "../myRole-Type.service";
import {ShowJobFilterService} from "../showJobFilter.service";
import {JobPosterModel} from "../model/jobPoster";
import {Industry} from "../model/industry";
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

  descModel:Description[] = new Array();
  private jobInformation = new JobInformation();
  private jobRequirement = new JobRequirement();
  private jobLocation = new JobLocation();
  private isShowIndustry:boolean = false;
  private isCandidate:boolean = false;
  private isShowComplexity:boolean = false;
  private isShowRoleList:boolean = false;
  private isShowRoletype:boolean = false;
  private isShowCapability:boolean = false;
  private isShowProficiency:boolean = false;
  private roletype:string;
  private showModalStyle:boolean = false;
  private complexities:Industry = new Industry();
  private proficiency:string[] = new Array();
  private competensies = new Description();
  private responsibilities = new Description();
  private jobPosterModel = new JobPosterModel();
  private jobForComplexity:Role[] = new Array(0);
  private flag:boolean = true;
  private highlightedSection:Section = new Section();


  constructor(private profileCreatorService:CandidateProfileService,
              private complexityService:ComplexityService,
              private jobinformation:MyJobInformationService,
              private jobrequirement:JobRequirementService,
              private myjoblocationService:MyJobLocationService,
              private jobpostroletype:MyJobPostRoleTypeService,
              private messageService:MessageService,
              private jobPostDescription:JonPostDescriptionService,
              private jobPostComplexiyservice:JobPostComplexityService,
              private jobPostProficiency:JobPostProficiencyService,
              private myRoleType:MyRoTypeTestService,
              private proficiencyService:ProficiencyService,
              private jobPostIndustryShow:JobIndustryShowService,
              private disableService:DisableTestService,
              private showJobFilter:ShowJobFilterService,
              private jobPostService:JobPosterService) {

    this.myRoleType.showTestRoleType$.subscribe(
      data=> {
        this.isShowRoletype = data;

      }
    );
    complexityService.showTest$.subscribe(
      data => {
        this.isShowComplexity = data;
      }
    );
    proficiencyService.showTest$.subscribe(
      data=> {
        this.isShowProficiency = data;
      }
    );
    this.jobPostIndustryShow.showIndustryt$.subscribe(
      data => {
        this.isShowIndustry = data;
      }
    );
    disableService.showTestDisable$.subscribe(
      data=> {
        this.isShowRoleList = data;
      }
    );

    this.jobinformation.showTestInformation$.subscribe(
      data=> {
        this.jobInformation = data;

      }
    );
    this.jobrequirement.showTestRequirement$.subscribe(
      data=> {
        this.jobRequirement = data;

      }
    );
    this.myjoblocationService.showTestLocation$.subscribe(
      data=> {
        this.jobLocation = data;

      }
    );
    this.jobpostroletype.showTestCapability$.subscribe(
      data=> {
        this.roletype = data;

      }
    );
    this.jobPostDescription.showTestJobPostDesc$.subscribe(
      data=> {
        if (data.type === "competensies")
          this.competensies.detail = (data.data.toString()).replace(/,/g, " ");
        if (data.type === "responsibilities")
          this.responsibilities.detail = (data.data.toString()).replace(/,/g, " ");
      }
    );
    this.jobPostComplexiyservice.showTestComplexity$.subscribe(
      data=> {
        this.complexities = data;

      }
    );
    this.jobPostProficiency.showTestJobPostProficiency$.subscribe(
      data=> {
        this.proficiency = data;

      }
    );
  }

  ngOnInit() {

   
      if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==='true') {
        this.isCandidate = true;
      }
    

    if (this.isCandidate != true) {
      this.highlightedSection.name = "JobProfile";
    }
  }

  postjob() {
    this.showModalStyle = !this.showModalStyle;
    this.jobPosterModel.competencies = this.competensies.detail;

    // this.jobPosterModel.profiencies = this.proficiency;
    this.jobPosterModel.responsibility = this.responsibilities.detail;
    this.jobPosterModel.postingDate = (new Date()).toISOString();


    console.log(this.jobPosterModel);
    console.log(this.responsibilities.detail);
    console.log(this.jobPosterModel.profiencies);

    this.jobPostService.postJob(this.jobPosterModel).subscribe(
      user => {
        console.log(user);
      },
      error => {
        console.log(error);
      });
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
    // this.postjob();
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
    console.log(this.highlightedSection);
    this.jobPosterModel = jobModel;
    //this.savejobPosterModelDetails();
    this.getRoles();
    this.getProficiency();
    this.isShowRoleList = true;
  }


  selectRole(roles:Role[]) {
    this.jobPosterModel.industry.roles = roles;
    //this.savejobPosterModelDetails();

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
          },
          error => this.onError(error));
    }
  }

  getProficiency() {

    this.profileCreatorService.getProficiency(this.jobPosterModel.industry.name)
      .subscribe(
        data => this.proficiencies = data.data,
        error => this.onError(error));
  }
}
