import {Component, OnInit} from "@angular/core";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage, NavigationRoutes, Messages} from "../../../framework/shared/constants";
import {Router} from "@angular/router";
import {DashboardService} from "../../../framework/dashboard/dashboard.service";
import {TestService} from "../test.service";
import {ComplexityService} from "../complexity.service";
import {ProficiencyService} from "../proficience.service";
import {ProfessionalService} from "../professional-service";
import {EducationalService} from "../educational-service";
import {AwardService} from "../award-service";
import {MyRoleListTestService} from "../myRolelist.service";
import {MyRoTypeTestService} from "../myRole-Type.service";
import {DisableTestService} from "../disable-service";
import {JobTitle} from "../model/jobTitle";
import {MYJobTitleService} from "../myJobTitle.service";
import {Candidate} from "../model/candidate";
import {ProfileCreatorService} from "./profile-creator.service";
import {MessageService} from "../../../framework/shared/message.service";
import {Message} from "../../../framework/shared/message";
import {Industry} from "../model/industry";
import {Role} from "../model/role";

@Component({
  moduleId: module.id,
  selector: 'cn-profile-creator',
  templateUrl: 'profile-creator.component.html',
  styleUrls: ['profile-creator.component.css']
})

export class ProfileCreatorComponent implements OnInit {

  private industries:Industry[] = new Array(0);
  private roles:Role[] = new Array(0);
  private rolesForMain:Role[] = new Array(0);
  private rolesForCapability:Role[] = new Array(0);
  private rolesForComplexity:Role[] = new Array(0);
  private roleTypes:string[] = new Array(0);
  private roleList:string[] = new Array()
  private primaryCapability:string[] = new Array()
  private proficiencies:string[] = new Array()
  private isComplexityPresent : boolean =false;

  whichStepsVisible:boolean[] = new Array(7);
  firstName:string;
  lastName:string;
  protected selectedvalue1:string;
  protected selectedvalue2:string;
  private fullName:string;
  private newUser:number;
  private chkEmployeeHistory:boolean = false;
  private valueOFshowOrHide:string;
  private chkCertification:boolean = false;
  private chkAboutMyself:boolean = false;
  private chkAwards:boolean = false;
  private showCapability:boolean = false;
  private showComplexity:boolean = false;
  private showProfeciency:boolean = false;
  private isRolesShow:boolean = false;
  private showfield:boolean = false;
  private isRoleTypeShow:boolean = false;
  private title:string = '';
  private jobTitle = new JobTitle();
  private isTitleFilled:boolean = true;
  private isShowRequired:boolean = true;
  private disableTitle:boolean = false;
  private candidate:Candidate = new Candidate();
  private candidateForRole:Role[];
  private candidateForCapability: Role[];
  private candidateForComplexity:Role[];

  constructor(private _router:Router,
              private dashboardService:DashboardService,
              private testService:TestService,
              private proficiencyService:ProficiencyService,
              private professionalService:ProfessionalService,
              private educationalService:EducationalService,
              private complexityService:ComplexityService,
              private myRoleType:MyRoTypeTestService,
              private messageService:MessageService,
              private awardService:AwardService,
              private myRolelist:MyRoleListTestService,
              private disableService:DisableTestService,
              private jobtitleservice:MYJobTitleService,
              private profileCreatorService:ProfileCreatorService) {

    this.myRolelist.showTestRolelist$.subscribe(
      data => {
        this.isRolesShow = data;
      }
    );

    disableService.showTestDisable$.subscribe(
      data=> {
        this.showfield = data;
      }
    );
    this.myRoleType.showTestRoleType$.subscribe(
      data=> {
        this.isRoleTypeShow = data;

      }
    );


    testService.showTest$.subscribe(
      data=> {
        this.whichStepsVisible[1] = data;
        this.showCapability = data;
      }
    );
    complexityService.showTest$.subscribe(
      data=> {
        this.whichStepsVisible[2] = data;
        this.showComplexity = data;
      }
    );

    // this services are for progressbar
    proficiencyService.showTest$.subscribe(
      data=> {
        this.whichStepsVisible[3] = data;
        this.showProfeciency = data;
      }
    );
    professionalService.showTest$.subscribe(
      data=> {
        this.whichStepsVisible[4] = data;
      }
    );
    educationalService.showTest$.subscribe(
      data=> {
        this.whichStepsVisible[5] = data;
      }
    );
    awardService.showTest$.subscribe(
      data=> {
        this.whichStepsVisible[6] = data;
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


  selectIndustry(industry:Industry) {
    this.candidate.industry = industry;
    this.saveCandidateDetails();
    this.getRoles();
    this.isRolesShow = true;
  }

  selectExperiencedIndustry(experiencedindustry:string[]) {
    this.candidate.intrestedIndustries = experiencedindustry;
    this.saveCandidateDetails();
  }


  selectRole(roles:Role[]) {
    this.candidate.industry.roles = roles;
    this.saveCandidateDetails();
    this.getRoleType();
    this.isRoleTypeShow = true;
    if (this.candidate.industry.roles) {
      if (this.candidate.industry.roles[0].capabilities) {
        if (this.candidate.industry.roles[0].capabilities.length > 0) {
          this.getComplexity();
          this.showComplexity = true;
          this.whichStepsVisible[2] = true;
          this.showProfeciency = true;
          this.getProficiency();
        }
      }
    }
  }

  selectRoleType(roleType:string) {
    this.candidate.roleType = roleType;
    this.saveCandidateDetails();
    this.getCapability();
    this.showCapability = true;
    this.whichStepsVisible[1] = true;

  }

  getIndustry() {
    this.profileCreatorService.getIndustries()
      .subscribe(
        industrylist => this.industries = industrylist.data,
        error => this.onError(error));
  }

  getRoles() {
    this.profileCreatorService.getRoles(this.candidate.industry.name)
      .subscribe(
        rolelist => this.rolesForMain = rolelist.data,
        error => this.onError(error));
  }

  getRoleType() {
    this.profileCreatorService.getRoleTypes()
      .subscribe(
        data=> this.roleTypes = data.roleTypes,
        error => this.onError(error));
  }

  getCapability() {
    for (let role of this.candidate.industry.roles) {
      this.roleList.push(role.name);
    }
    if (this.candidate.industry.name != undefined && this.roleList != undefined) {
      this.profileCreatorService.getCapability(this.candidate.industry.name, this.roleList)
        .subscribe(
          rolelist => {
            this.rolesForCapability = rolelist.data
            this.getCandidateForCapability();
          },
          error => this.onError(error));
    }
  }

  getComplexity() {
    for (let role of this.candidate.industry.roles) {
      for (let capability of role.capabilities) {
        if(capability.isPrimary){
          this.primaryCapability.push(capability.name);
        }
      }
    }
    if (this.candidate.industry.name != undefined && this.roleList != undefined) {
      this.profileCreatorService.getComplexity(this.candidate.industry.name, this.roleList, this.primaryCapability)
        .subscribe(
          rolelist => {
            this.rolesForComplexity = rolelist.data;
            this.getCandidateForComplexity();

          },
              error => this.onError(error));
    }
  }

  getCandidateProfile() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData),
        error => this.onError(error));
  }

  getCandidateForCapability() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => this.candidateForCapability = candidateData.data[0].industry.roles,
        error => this.onError(error));
  }

  getCandidateForComplexity() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => {
          this.candidateForComplexity = candidateData.data[0].industry.roles;
          if(this.candidateForComplexity[0].capabilities[0].complexities.length>0){
            //this.candidateForComplexity[0].isForTest=true;
            this.isComplexityPresent =true;
          }
        },
            error => this.onError(error));
  }

  getProficiency(){
    this.profileCreatorService.getProficiency(this.candidate.industry.name)
      .subscribe(
        data => this.proficiencies=data.data,
        error => this.onError(error));
  }




  OnCandidateDataSuccess(candidateData:any) {
    this.candidate = candidateData.data[0];
    this.candidateForRole = candidateData.data[0].industry.roles;

    if (this.candidate.jobTitle !== undefined) {
      this.disableTitle = true;
    }
    if (this.candidate.industry.name !== undefined) {
      this.isRolesShow = true;
      this.getRoles();

    }
    if (this.candidate.roleType !== undefined) { debugger
      this.showCapability = true;
      this.getCapability();
      this.whichStepsVisible[1] = true;
    }
    if (this.candidate.industry.roles.length > 0) { debugger
      this.getRoleType();
      this.getProficiency();
      this.isRoleTypeShow = true;
      if (this.candidate.industry.roles[0].capabilities.length >= 1) {
        this.getComplexity();
        this.showComplexity = true;
        this.whichStepsVisible[2] = true;
        if (this.candidate.industry.roles[0].capabilities[0].complexities.length > 0) {
          this.whichStepsVisible[3] = true;
          this.showProfeciency = true;

        }
      }

    }
    if (this.candidate.professionalDetails !== undefined) { 
      this.whichStepsVisible[4] = true;
    }
    if (this.candidate.academics !== undefined) { 
      this.whichStepsVisible[5] = true;
    }
    if (this.candidate.awards !== undefined) { 
      this.whichStepsVisible[6] = true;
    }
  }

  getUserProfile() {
    this.dashboardService.getUserProfile()
      .subscribe(
        userprofile => this.onUserProfileSuccess(userprofile),
        error => this.onUserProfileError(error));
  }


  onUserProfileSuccess(result:any) {

    this.firstName = LocalStorageService.getLocalValue(LocalStorage.FIRST_NAME);
    this.lastName = LocalStorageService.getLocalValue(LocalStorage.LAST_NAME);
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

    this.valueOFshowOrHide = event;

  }

  hideEmployeeHistory() {
    this.chkEmployeeHistory = !this.chkEmployeeHistory;
  }

  hideCertification() {
    this.chkCertification = !this.chkCertification;
  }

  hideAboutMyself() {
    this.chkAboutMyself = !this.chkAboutMyself;
  }

  hideAwards() {
    this.chkAwards = !this.chkAwards;
  }

  logOut() {
    window.localStorage.clear();
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

  onSubmit() {
    //if(this.candidate.jobTitle && this.candidate.industry.name && this.candidate.intrestedIndustries.length) {
      var message = new Message();
      message.custom_message = Messages.MSG_SUCCESS_FOR_PROFILE_CREATION_STATUS;
      message.isError = false;
      this.messageService.message(message);
   // }

  }

}
