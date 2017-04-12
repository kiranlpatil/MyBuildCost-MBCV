
import { Component } from '@angular/core';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';
import { LocalStorage, NavigationRoutes } from '../../../framework/shared/constants';
import { Router } from '@angular/router';
import { JobInformation } from '../model/job-information';
import { JobRequirement } from '../model/job-requirement';
import { JobLocation } from '../model/job-location';
import { MyJobLocationService } from '../myjob-location.service';
import { MyJobPostRoleTypeService } from '../jobpost-roletype.service';
import { JonPostDescriptionService } from '../job-post-description.service';
import { JobPostComplexityService } from '../job-post-complexity.service';
import { Description } from '../model/description';
import { JobPostProficiencyService } from '../jobPostProficiency.service';
import { MyJobInformationService } from '../myJobInformation.service';
import { JobRequirementService } from '../myJobRequirement.service';
import { JobIndustryShowService } from '../myJobIndustryShow.service';
import { DisableTestService } from '../disable-service';
import { ComplexityService } from '../complexity.service';
import { ProficiencyService } from '../proficience.service';
import { TestService } from '../test.service';
import { MyRoTypeTestService } from '../myRole-Type.service';
import { ShowJobFilterService } from '../showJobFilter.service';
import {JobPosterModel} from "../model/jobPoster";
import {Industry} from "../model/industry";
import {JobPosterService} from "./job-poster.service";
import {Role} from "../model/role";
import {ProfileCreatorService} from "../profile-creator/profile-creator.service";
import {Message} from "../../../framework/shared/message";
import {MessageService} from "../../../framework/shared/message.service";


@Component({
  moduleId: module.id,
  selector: 'cn-job-poster',
  templateUrl: 'job-poster.component.html',
  styleUrls: ['job-poster.component.css']
})

export class JobPosterComponent {
  private industries: Industry[]=new Array(0);
  private roles: Role[]=new Array(0);
  private roleTypes: string[]=new Array(0);


  descModel:Description[]=new Array();
  private jobInformation=new JobInformation();
  private jobRequirement=new JobRequirement();
  private jobLocation=new JobLocation();
  private isShowIndustry:boolean=false;
  private isShowComplexity:boolean=false;
  private isShowRoleList:boolean=false;
  private isShowRoletype:boolean=false;
  private isShowCapability:boolean=false;
  private isShowProficiency:boolean=false;
  private roletype :string;
  private showModalStyle: boolean = false;
  private complexities :Industry=new Industry();
  private proficiency :string[]=new Array();
  private competensies=new Description();
  private responsibilities=new Description();
  private jobPosterModel=new JobPosterModel();
  constructor(private _router:Router,
              private profileCreatorService:ProfileCreatorService,
              private complexityService: ComplexityService,
              private jobinformation:MyJobInformationService,
              private jobrequirement:JobRequirementService,
              private myjoblocationService:MyJobLocationService,
              private jobpostroletype:MyJobPostRoleTypeService,
              private messageService:MessageService ,
              private jobPostDescription:JonPostDescriptionService ,
              private jobPostComplexiyservice:JobPostComplexityService,
              private jobPostProficiency:JobPostProficiencyService,
              private myRoleType:MyRoTypeTestService,
              private testService : TestService,
              private proficiencyService : ProficiencyService,
              private jobPostIndustryShow:JobIndustryShowService,
              private disableService:DisableTestService,
              private showJobFilter:ShowJobFilterService,
              private jobPostService:JobPosterService) {

    this.myRoleType.showTestRoleType$.subscribe(
      data=> {
        this.isShowRoletype=data;

      }
    ); testService.showTest$.subscribe(
      data => {
        this.isShowCapability=data;
      }
    );

    complexityService.showTest$.subscribe(
      data => {
        this.isShowComplexity=data;
      }
    );
    proficiencyService.showTest$.subscribe(
      data=> {
        this.isShowProficiency=data;
      }
    );
    this.jobPostIndustryShow.showIndustryt$.subscribe(
      data => {
        this.isShowIndustry=data;


      }
    );
    disableService.showTestDisable$.subscribe(
      data=> {
        this.isShowRoleList=data;
      }
    );

    this.jobinformation.showTestInformation$.subscribe(
      data=> {
        this.jobInformation=data;

      }
    );
    this.jobrequirement.showTestRequirement$.subscribe(
      data=> {
        this.jobRequirement=data;

      }
    );
    this.myjoblocationService.showTestLocation$.subscribe(
      data=> {
        this.jobLocation=data;

      }
    );
    this.jobpostroletype.showTestCapability$.subscribe(
      data=> {
        this.roletype=data;
      }
    );
    this.jobPostDescription.showTestJobPostDesc$.subscribe(
      data=> {
        if(data.type==="competensies")
          this.competensies.detail=(data.data.toString()).replace (/,/g, " ");
        if(data.type==="responsibilities")
          this.responsibilities.detail=(data.data.toString()).replace (/,/g, " ");
      }
    );
    this.jobPostComplexiyservice.showTestComplexity$.subscribe(
      data=> {
        this.complexities=data;

      }
    );
    this.jobPostProficiency.showTestJobPostProficiency$.subscribe(
      data=> {
        this.proficiency=data;

      }
    );
  }


  postjob() {
    this.jobPosterModel.competencies=this.competensies.detail;

    this.jobPosterModel.profiencies=this.proficiency;
    this.jobPosterModel.responsibility=this.responsibilities.detail;
    this.jobPosterModel.postingDate= (new Date()).toISOString();


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
    this.postjob();
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

  selectJobInformation(jobInformation:JobInformation){
    this.jobPosterModel.jobTitle=jobInformation.jobTitle;
    this.jobPosterModel.hiringManager=jobInformation.hiringManager;
    this.jobPosterModel.department=jobInformation.department;
  }

  selectJobLocation(jobLocation:JobLocation){
    this.jobPosterModel.location = jobLocation;
  }

  selectExperiencedIndustry(experiencedindustry:string[]){
    this.jobPosterModel.interestedIndustry = experiencedindustry;
  }

  selectJobRequirement(jobRequirement :JobRequirement){
    this.jobPosterModel.education=jobRequirement.education;
    this.jobPosterModel.experience=jobRequirement.experience;
    this.jobPosterModel.joiningPeriod=jobRequirement.noticeperiod;
    this.jobPosterModel.salary=jobRequirement.salary;
    if(jobRequirement.noticeperiod !== undefined) {
      this.isShowIndustry = true;
      this.getIndustry();
    }
  }
  selectIndustry(industry:Industry){
    this.jobPosterModel.industry=industry;
    //this.saveCandidateDetails();
    this.getRoles();
    this.isShowRoleList=true;
  }


  selectRole(roles:Role[]){
    this.jobPosterModel.industry.roles=roles;
    //this.saveCandidateDetails();
    this.getRoleType();
    this.isShowRoletype=true;
  }

  selectRoleType(roleType:string){
    this.jobPosterModel.roleType=roleType;
//    this.saveCandidateDetails();
    //this.getCapability();
  }

  getIndustry(){
    this.profileCreatorService.getIndustries()
      .subscribe(
        industrylist => this.industries=industrylist.data,
        error => this.onError(error));
  }

  getRoles(){
    this.profileCreatorService.getRoles(this.jobPosterModel.industry.name)
      .subscribe(
        rolelist => this.roles=rolelist.data,
        error => this.onError(error));
  }

  getRoleType(){
    this.profileCreatorService.getRoleTypes()
      .subscribe(
        data=> this.roleTypes=data.roleTypes,
        error => this.onError(error));
  }
  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
}
