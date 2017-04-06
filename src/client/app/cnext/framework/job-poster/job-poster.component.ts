
import { Component } from '@angular/core';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';
import { LocalStorage, NavigationRoutes } from '../../../framework/shared/constants';
import { Router } from '@angular/router';
import { JobInformation } from '../model/job-information';
import { JobRequirement } from '../model/job-requirement';
import { JobLocation } from '../model/job-location';
import { MyJobLocationService } from '../myjob-location.service';
import { MyJobPostcapabilityService } from '../jobpost-capabilities.service';
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
  private capabilityIds :string[]=new Array();
  private complexities :string[]=new Array();
  private proficiency :string[]=new Array();
  private model=new Description();
  constructor(private _router:Router,
              private complexityService: ComplexityService,
              private jobinformation:MyJobInformationService,
              private jobrequirement:JobRequirementService,
              private myjoblocationService:MyJobLocationService,
              private jobpostcapability:MyJobPostcapabilityService,
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
    this.jobpostcapability.showTestCapability$.subscribe(
      data=> {
        this.capabilityIds=data;

      }
    );
    this.jobPostDescription.showTestJobPostDesc$.subscribe(
      data=> {
        this.model=data;

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
    console.log('capabilities ids',this.capabilityIds);
    console.log(this.complexities);
    console.log(this.model);

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
