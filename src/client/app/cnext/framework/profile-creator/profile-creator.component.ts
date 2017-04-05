import { Component ,OnInit} from '@angular/core';
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
import { myRoleListTestService } from '../myRolelist.service';
//import { MyRoleService } from '../role-service';
import { myRoTypeTestService } from '../myRole-Type.service';
import { DisableTestService } from '../disable-service';

@Component({
  moduleId: module.id,
  selector: 'cn-profile-creator',
  templateUrl: 'profile-creator.component.html',
  styleUrls: ['profile-creator.component.css']
})

export class ProfileCreatorComponent implements OnInit {
  private fullName: string;private firstName: string;private lastName: string;
  private   newUser:number;
  private  chkEmployeeHistory:boolean=false;
  private valueOFshowOrHide:string;
  private  chkCertification:boolean=false;
  private  chkAboutMyself:boolean=false;
  private  chkAwards:boolean=false;
  private  showCapability:boolean=false;
  private  showComplexity:boolean=false;
  private  showProfeciency:boolean=false;
  private  whichStepsVisible : boolean[]=new Array(7);
  private isRolesShow:boolean=false;
  private showfield:boolean=false;
  private isRoleTypeShow:boolean=false;
  protected  selectedvalue1:string;
  protected selectedvalue2:string;

  constructor(private _router:Router,
              private dashboardService:DashboardService,
              private testService : TestService,
              private proficiencyService : ProficiencyService,
              private professionalService : ProfessionalService,
              private educationalService : EducationalService,
              private complexityService : ComplexityService,
              private myRoleType:myRoTypeTestService,
              private awardService: AwardService,private myRolelist :myRoleListTestService,private disableService:DisableTestService) {

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
  }

  onUserProfileError(error:any) {
    console.log(error);
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
}
