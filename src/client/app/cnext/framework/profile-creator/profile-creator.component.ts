import { Component ,OnInit } from '@angular/core';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';
import { LocalStorage, NavigationRoutes } from '../../../framework/shared/constants';
import { Router } from '@angular/router';
import { DashboardService } from '../../../framework/dashboard/dashboard.service';
import { TestService } from '../test.service';
import { ComplexityService } from '../complexity.service';
import { ProficiencyService } from '../proficience.service';
import { ProfessionalService } from '../professional-service';
import { EducationalService } from '../educational-service';
import { AwardService } from '../award-service';
import { MyRoleListTestService } from '../myRolelist.service';
import { MyRoTypeTestService } from '../myRole-Type.service';
import { DisableTestService } from '../disable-service';
import { JobTitle } from '../model/jobTitle';
import { MYJobTitleService } from '../myJobTitle.service';
import {Candidate} from "../model/candidate";
import {ProfileCreatorService} from "./profile-creator.service";
import {MessageService} from "../../../framework/shared/message.service";
import {Message} from "../../../framework/shared/message";
import {MyIndustryService} from "../industry-service";

@Component({
  moduleId: module.id,
  selector: 'cn-profile-creator',
  templateUrl: 'profile-creator.component.html',
  styleUrls: ['profile-creator.component.css']
})

export class ProfileCreatorComponent implements OnInit {

  whichStepsVisible : boolean[]=new Array(7);
  firstName: string;
  lastName: string;
  protected  selectedvalue1:string;
  protected selectedvalue2:string;
  private fullName: string;
  private   newUser:number;
  private  chkEmployeeHistory:boolean=false;
  private valueOFshowOrHide:string;
  private  chkCertification:boolean=false;
  private  chkAboutMyself:boolean=false;
  private  chkAwards:boolean=false;
  private  showCapability:boolean=false;
  private  showComplexity:boolean=false;
  private  showProfeciency:boolean=false;
  private isRolesShow:boolean=false;
  private showfield:boolean=false;
  private isRoleTypeShow:boolean=false;
  private title:string='';
  private jobTitle=new JobTitle();
  private isTitleFilled:boolean=true;
  private isShowRequired:boolean=true;
  private disableTitle:boolean=false;
  private candidate:Candidate=new Candidate();

  constructor(private _router:Router,
              private dashboardService:DashboardService,
              private testService : TestService,
              private myindustryService : MyIndustryService,
              private proficiencyService : ProficiencyService,
              private professionalService : ProfessionalService,
              private educationalService : EducationalService,
              private complexityService : ComplexityService,
              private myRoleType:MyRoTypeTestService,
              private messageService:MessageService ,
              private awardService: AwardService,
              private myRolelist : MyRoleListTestService,
              private disableService: DisableTestService,
              private jobtitleservice: MYJobTitleService,
              private profileCreatorService:ProfileCreatorService) {

    this.myRolelist.showTestRolelist$.subscribe(
      data => {
        this.isRolesShow=data;
      }
    );

    disableService.showTestDisable$.subscribe(
      data=> {
        this.showfield=data;
      }
    );
    this.myRoleType.showTestRoleType$.subscribe(
      data=> {
        this.isRoleTypeShow=data;

      }
    );


    testService.showTest$.subscribe(
        data=> {
            this.whichStepsVisible[1]=data;
          this.showCapability=data;
        }
      );
      complexityService.showTest$.subscribe(
        data=> {
          this.whichStepsVisible[2]= data;
          this.showComplexity= data;
        }
      );
      proficiencyService.showTest$.subscribe(
        data=> {
          this.whichStepsVisible[3]=data;
          this.showProfeciency=data;
        }
      );
    professionalService.showTest$.subscribe(
        data=> {
          this.whichStepsVisible[4]=data;
        }
      );
    educationalService.showTest$.subscribe(
        data=> {
          this.whichStepsVisible[5]=data;
        }
      );
    awardService.showTest$.subscribe(
      data=> {
        this.whichStepsVisible[6]=data;
      }
    );
  }


  ngOnInit() {


    this.newUser = parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGED_IN));
    if (this.newUser === 0) {
      this._router.navigate([NavigationRoutes.APP_START]);
    } else {
      this.getUserProfile();
    }

  }

  getCandidateProfile(){
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData),
        error => this.onError(error));
  }

  OnCandidateDataSuccess(candidateData:any){
    this.candidate=candidateData.data[0];
    if(this.candidate.jobTitle !== undefined){
      this.title=this.candidate.jobTitle;
      this.disableTitle=true;
    }
    if(this.candidate.roleType !== undefined){
      this.isRoleTypeShow=true;
    }
    if(this.candidate.industry.roles.length>0){
      this.isRolesShow=true;
      this.myindustryService.change(this.candidate.industry.name);
      if(this.candidate.industry.roles[0].capabilities.length>0){
        this.showCapability=true;
      }
      if(this.candidate.industry.roles[0].capabilities[0].complexities.length>0){
        this.showComplexity=true;
      }
    }

    if(this.candidate.professionalDetails !== undefined){
      this.showProfeciency=true;
    }

  }

  getUserProfile() {
    this.dashboardService.getUserProfile()
      .subscribe(
        userprofile => this.onUserProfileSuccess(userprofile),
        error => this.onUserProfileError(error));
  }


  onUserProfileSuccess(result:any) {
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID, result.data.email);
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, result.data.mobile_number);
    LocalStorageService.setLocalValue(LocalStorage.FIRST_NAME, result.data.first_name);
    LocalStorageService.setLocalValue(LocalStorage.LAST_NAME, result.data.last_name);
    this.fullName=result.data.first_name + result.data.last_name;
    this.firstName=result.data.first_name;
    this.lastName=result.data.last_name;
    this.getCandidateProfile();
  }

  onUserProfileError(error:any) {
    console.log(error);
  }

  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  showorhide(event:string) {

    this.valueOFshowOrHide=event;

  }

  hideEmployeeHistory() {
    this.chkEmployeeHistory =!this.chkEmployeeHistory ;
  }

  hideCertification() {
    this.chkCertification =!this.chkCertification ;
  }

  hideAboutMyself() {
    this.chkAboutMyself =!this.chkAboutMyself ;
  }

  hideAwards() {
    this.chkAwards =!this.chkAwards ;
  }

  logOut() {
    LocalStorageService.removeLocalValue(LocalStorage.ACCESS_TOKEN);
    LocalStorageService.removeLocalValue(LocalStorage.IS_THEME_SELECTED);
    LocalStorageService.removeLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
    LocalStorageService.removeLocalValue(LocalStorage.USER_ID);
    LocalStorageService.removeLocalValue(LocalStorage.IS_CANDIDATE);
    LocalStorageService.setLocalValue(LocalStorage.IS_LOGED_IN, 0);
    this._router.navigate([NavigationRoutes.APP_START]);
  }
  onSubmit() {

    if(this.title==='') {
      this.isTitleFilled=false;
    } else {
      this.isShowRequired=false;
      this.isTitleFilled=true;
    }
  }
  selectedtitle(title:string) {
     this.candidate.jobTitle=title;
   //  this.jobtitleservice.change( this.jobTitle.title);
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      },
      error => {
        console.log(error);
      });


  }

}
