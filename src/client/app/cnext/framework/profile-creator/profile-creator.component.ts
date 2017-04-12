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
import {Industry} from "../model/industry";
import {Role} from "../model/role";

@Component({
  moduleId: module.id,
  selector: 'cn-profile-creator',
  templateUrl: 'profile-creator.component.html',
  styleUrls: ['profile-creator.component.css']
})

export class ProfileCreatorComponent implements OnInit {

  private industries: Industry[]=new Array(0);
  private roles: Role[]=new Array(0);
  private roleTypes: string[]=new Array(0);






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

    this.getIndustry();
  }



  selectIndustry(industry:Industry){
    this.candidate.industry=industry;
    this.saveCandidateDetails();
    this.getRoles();
  }


  selectRole(roles:Role[]){
    this.candidate.industry.roles=roles;
    this.saveCandidateDetails();
    this.getRoleType();
  }

  selectRoleType(roleType:string){
    this.candidate.roleType=roleType;
    this.saveCandidateDetails();
    this.getRoleType();
  }

  getIndustry(){debugger
    this.profileCreatorService.getIndustries()
      .subscribe(
        industrylist => this.industries=industrylist.data,
        error => this.onError(error));
  }

  getRoles(){
    this.profileCreatorService.getRoles(this.candidate.industry.name)
      .subscribe(
        rolelist => this.roles=rolelist.data,
        error => this.onError(error));
  }

  getRoleType(){debugger
    this.profileCreatorService.getRoleTypes()
      .subscribe(
        data=> this.roleTypes=data.roleTypes,
        error => this.onError(error));
  }
  getCandidateProfile(){debugger
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData),
        error => this.onError(error));
  }

  OnCandidateDataSuccess(candidateData:any){
    this.candidate=candidateData.data[0];
    if(this.candidate.jobTitle !== undefined){
      this.disableTitle=true;
    }
    if(this.candidate.industry.name !== undefined){
      this.isRolesShow=true;
      this.getRoles();

    }
    if(this.candidate.roleType !== undefined){
      this.showCapability=true;
    }
    if(this.candidate.industry.roles.length>0){
      this.getRoleType();
      this.isRoleTypeShow=true;
      if(this.candidate.industry.roles[0].capabilities.length>=1){
        this.showComplexity=true;
        if(this.candidate.industry.roles[0].capabilities[0].complexities.length>0){
          this.showProfeciency=true;
        }
      }

    }
  }

  getUserProfile() {
    this.dashboardService.getUserProfile()
      .subscribe(
        userprofile => this.onUserProfileSuccess(userprofile),
        error => this.onUserProfileError(error));
  }


  onUserProfileSuccess(result:any) {

    this.firstName= LocalStorageService.getLocalValue(LocalStorage.FIRST_NAME);
    this.lastName=LocalStorageService.getLocalValue(LocalStorage.LAST_NAME);
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

  selectedtitle() {
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      },
      error => {
        this.onError(error)
      });

  }

  saveCandidateDetails() {
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      },
      error => {
        this.onError(error)
      });

  }

}
