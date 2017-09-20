import {Component} from '@angular/core';
import {Candidate} from '../../../user/models/candidate';
import {ErrorService} from '../error.service';
import {UserData} from '../model/userData';
import {AdminDashboardService} from './admin-dashboard.service';
import {LoaderService} from '../../../shared/loader/loaders.service';


@Component({
  moduleId: module.id,
  selector: 'cn-admin-dashboard',
  templateUrl: 'admin-dashboard.component.html',
  styleUrls: ['admin-dashboard.component.css']
})

export class AdminDashboardComponent {
  private candidate: Candidate = new Candidate();
  private userData: UserData = new UserData();
  private numberOfCandidates:number=0;
  private numberOfRecruiters:number=0;
  constructor( private errorService: ErrorService, private loaderService: LoaderService,private adminDashboardService: AdminDashboardService,) {
      this.loaderService.start();
      this.getUserProfile();
      this.getAllUser();
  }
getAllUser() {
  this.adminDashboardService.getAllUsers()
    .subscribe(
      userprofile => this.onGetAllUsersSuccess(userprofile),
      error => this.errorService.onError(error));
}
  getUserProfile() {
    this.adminDashboardService.getUserProfile()
      .subscribe(
        userprofile => this.onUserProfileSuccess(userprofile),
        error => this.errorService.onError(error));
  }
  onUserProfileSuccess(candidateData: any) {
    this.candidate.basicInformation = candidateData.data;
  }
  onGetAllUsersSuccess(userprofile:any) {
    this.userData=userprofile.data;
    this.numberOfCandidates=this.userData.candidate.length;
    this.numberOfRecruiters=this.userData.recruiter.length;
    this.loaderService.stop();
  }
}
