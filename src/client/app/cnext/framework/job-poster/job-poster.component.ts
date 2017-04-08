
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
  private complexities :string[]=new Array();
  private proficiency :string[]=new Array();
  private competensies=new Description();
  private responsibilities=new Description();
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
              private showJobFilter:ShowJobFilterService) {

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
      data=> {debugger
        if(data.type==="competensies")
        this.competensies=data.data;
        if(data.type==="responsibilities")
        this.responsibilities=data.data;
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
    console.log(this.jobInformation);
    console.log(this.jobRequirement);
    console.log(this.jobLocation);
    console.log(this.roletype);
    console.log(this.complexities);
    console.log(this.competensies);
    console.log(this.responsibilities);
  }
  mockupSearch() {
    this.showJobFilter.change(true);
  }

  logOut() {
    LocalStorageService.removeLocalValue(LocalStorage.IS_CANDIDATE);
    LocalStorageService.removeLocalValue(LocalStorage.ACCESS_TOKEN);
    LocalStorageService.removeLocalValue(LocalStorage.IS_THEME_SELECTED);
    LocalStorageService.removeLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
    LocalStorageService.removeLocalValue(LocalStorage.USER_ID);
    LocalStorageService.setLocalValue(LocalStorage.IS_LOGED_IN, 0);
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
