import {Component, OnInit} from "@angular/core";
import {ErrorService} from "../../shared/services/error.service";
import {AdminDashboardService} from "./admin-dashboard.service";
import {Candidate} from "../../user/models/candidate";


@Component({
  moduleId: module.id,
  selector: 'cn-admin-dashboard',
  templateUrl: 'admin-dashboard.component.html',
  styleUrls: ['admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit {
  candidate: Candidate = new Candidate();
  numberOfCandidates: number = 0;
  numberOfRecruiters: number = 0;

  constructor(private errorService: ErrorService, private adminDashboardService: AdminDashboardService) {

  }

  ngOnInit(): void {
    this.getUserProfile();
    this.getCountOfAllUsers();
  }

  getCountOfAllUsers() {
    this.adminDashboardService.getCountOfUsers()
      .subscribe(
        result => this.onGetCountOfUsersSuccess(result.data),
        error => this.errorService.onError(error));
  }

  onGetCountOfUsersSuccess(data: any) {
    this.numberOfCandidates = data.totalNumberOfCandidates;
    this.numberOfRecruiters = data.totalNumberOfRecruiters;
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
