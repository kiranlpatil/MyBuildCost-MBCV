import { Component } from '@angular/core';
import { Candidate } from '../model/candidate';
import {ErrorService} from "../error.service";
import {DashboardService} from "../../../framework/dashboard/dashboard.service";
import {UserData} from "../model/userData";
import {AdminDashboardService} from "./admin-dashboard.service";


@Component({
  moduleId: module.id,
  selector: 'cn-admin-dashboard',
  templateUrl: 'admin-dashboard.component.html',
  styleUrls: ['admin-dashboard.component.css']
})

export class AdminDashboardComponent {
  private candidate: Candidate = new Candidate();
  private userData: UserData = new UserData();
  constructor( private errorService: ErrorService,private adminDashboardService: AdminDashboardService,) {
      this.getUserProfile();
      this.getAllUser();
  }
getAllUser() {
  this.adminDashboardService.getAllUsers()
    .subscribe(
      userprofile => this.userData=userprofile.data,
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
}
