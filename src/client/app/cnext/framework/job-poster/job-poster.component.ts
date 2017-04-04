
import { Component } from '@angular/core';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';
import { LocalStorage, NavigationRoutes } from '../../../framework/shared/constants';
import { Router } from '@angular/router';
import { MyJobInformationService } from '../job-information/job-information.service';
import { JobInformation } from '../model/job-information';
import { JobRequirement } from '../model/job-requirement';
import { JobRequirementService } from '../job-requirement/job-requirement.service';
import { JobLocationService } from '../job-location/job-location.service';
import { JobLocation } from '../model/job-location';
import { myJobLocationService } from '../myjob-location.service';
import { myJobPostcapabilityService } from '../jobpost-capabilities.service';
import { JonPostDescriptionService } from '../job-post-description.service';
import { JobPostComplexityService } from '../job-post-complexity.service';
import { description } from '../model/description';
import { JobPostProficiencyService } from "../jobPostProficiency.service";


@Component({
  moduleId: module.id,
  selector: 'cn-job-poster',
  templateUrl: 'job-poster.component.html',
  styleUrls: ['job-poster.component.css']
})

export class JobPosterComponent {

  private jobInformation=new JobInformation();
  private jobRequirement=new JobRequirement();
  private jobLocation=new JobLocation();
  private capabilityIds :string[]=new Array();
  private complexities :string[]=new Array();
  private proficiency :string[]=new Array();
  private descModel:description[]=new Array();
  private model=new description();
  constructor(private _router:Router,
              private jobinformation:MyJobInformationService,
              private jobrequirement:JobRequirementService,
              private myjoblocationService:myJobLocationService,
              private jobpostcapability:myJobPostcapabilityService,
              private jobPostDescription:JonPostDescriptionService ,
              private jobPostComplexiyservice:JobPostComplexityService,
              private jobPostProficiency:JobPostProficiencyService) {
    this.jobinformation.showTestInformation$.subscribe(
      data=>{
        this.jobInformation=data;

      }
    );
    this.jobrequirement.showTestRequirement$.subscribe(
      data=>{
        this.jobRequirement=data;

      }
    );
    this.myjoblocationService.showTestLocation$.subscribe(
      data=>{
        this.jobLocation=data;

      }
    );
    this.jobpostcapability.showTestCapability$.subscribe(
      data=>{
        this.capabilityIds=data;

      }
    );
    this.jobPostDescription.showTestJobPostDesc$.subscribe(
      data=>{
        this.model=data;

      }
    );
    this.jobPostComplexiyservice.showTestComplexity$.subscribe(
      data=>{
        this.complexities=data;

      }
    );
    this.jobPostProficiency.showTestJobPostProficiency$.subscribe(
      data=>{
        this.proficiency=data;

      }
    );


  }


  ngOnInit() {


  }

  postjob() {
     console.log(this.jobInformation);
    console.log(this.jobRequirement);
    console.log(this.jobLocation);
    console.log('capabilities ids',this.capabilityIds);
    console.log(this.complexities);

      console.log(this.model);



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
