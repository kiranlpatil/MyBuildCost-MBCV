
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


@Component({
  moduleId: module.id,
  selector: 'cn-job-poster',
  templateUrl: 'job-poster.component.html',
  styleUrls: ['job-poster.component.css']
})

export class JobPosterComponent {
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
              private complexityService: ComplexityService,
              private jobinformation:MyJobInformationService,
              private jobrequirement:JobRequirementService,
              private myjoblocationService:MyJobLocationService,
              private jobpostroletype:MyJobPostRoleTypeService,
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


  postjob() {debugger
    this.jobPosterModel.jobTitle=this.jobInformation.jobTitle;
    this.jobPosterModel.competencies=this.competensies.detail;
    this.jobPosterModel.education=this.jobRequirement.education;
    this.jobPosterModel.experience==this.jobRequirement.experience;
    this.jobPosterModel.hiringManager=this.jobInformation.hiringManager;
    this.jobPosterModel.joiningPeriod=this.jobRequirement.noticeperiod;
    this.jobPosterModel.profiencies=this.proficiency;
    this.jobPosterModel.salary=this.jobRequirement.salary;
    this.jobPosterModel.responsibility=this.responsibilities.detail;
    this.jobPosterModel.department=this.jobInformation.department;
    this.jobPosterModel.industry=this.complexities;
    this.jobPosterModel.location=this.jobLocation;
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
  showHideModal() {debugger
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
}
