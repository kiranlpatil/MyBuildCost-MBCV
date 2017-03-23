
import {Component} from '@angular/core';
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage, NavigationRoutes} from "../../../framework/shared/constants";
import {Router} from "@angular/router";
import {DashboardService} from "../../../framework/dashboard/dashboard.service";


@Component({
  moduleId: module.id,
  selector: 'cn-profile-creator',
  templateUrl: 'profile-creator.component.html',
  styleUrls: ['profile-creator.component.css']
})

export class ProfileCreatorComponent {
  private fullName: string;private firstName: string;private lastName: string;
  private   newUser:number;
  private  chkEmployeeHistory:boolean=false;
  private  chkCertification:boolean=false;
  private  chkAboutMyself:boolean=false;
  private  chkAwards:boolean=false;
  constructor(private _router:Router, private dashboardService:DashboardService) {
  }


  ngOnInit(){
    this.newUser = parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGED_IN));
    if (this.newUser === 0) {
      this._router.navigate([NavigationRoutes.APP_START]);
    } else {
      this.getUserProfile();
    }

  }
  getUserProfile(){
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

  hideEmployeeHistory(){
    this.chkEmployeeHistory =!this.chkEmployeeHistory ;
  }

  hideCertification(){
    this.chkCertification =!this.chkCertification ;
  }

  hideAboutMyself(){
    this.chkAboutMyself =!this.chkAboutMyself ;
  }

  hideAwards(){
    this.chkAwards =!this.chkAwards ;
  }
}
