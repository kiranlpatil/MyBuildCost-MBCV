import {Component} from "@angular/core";
import {Candidate} from "../../user/models/candidate";
import {ErrorService} from "../../shared/services/error.service";
import {UserData} from "../models/userData";
import {AdminDashboardService} from "./admin-dashboard.service";
import {LoaderService} from "../../shared/loader/loaders.service";


@Component({
  moduleId: module.id,
  selector: 'cn-admin-dashboard',
  templateUrl: 'admin-dashboard.component.html',
  styleUrls: ['admin-dashboard.component.css']
})

export class AdminDashboardComponent {
  candidate: Candidate = new Candidate();
  userData: UserData = new UserData();
  numberOfCandidates: number = 0;
  numberOfRecruiters: number = 0;
  public filterData: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q",
    "r", "s", "t", "u", "v", "w", "x", "y", "z"]

  constructor(private errorService: ErrorService, private loaderService: LoaderService,
              private adminDashboardService: AdminDashboardService,) {
    this.loaderService.start();
    this.getUserProfile();
    this.getAllCandidates();
    this.getAllRecruiters();
    this.getCountOfAllUsers();
  }

  getAllCandidates() {
    this.adminDashboardService.getAllCandidates("a")
      .subscribe(
        candidateProfile => this.onGetAllCandidateSuccess(candidateProfile),
        error => this.errorService.onError(error));
  }

  getCountOfAllUsers() {
    this.adminDashboardService.getCountOfUsers()
      .subscribe(
        result => this.onGetCountOfUsersSuccess(result.data),
        error => this.errorService.onError(error));
  }

  getAllRecruiters() {
    this.adminDashboardService.getAllRecruiters("a")
      .subscribe(
        recruiterProfile => this.onGetAllRecruiterSuccess(recruiterProfile),
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

  onGetCountOfUsersSuccess(data: any) {
    this.numberOfCandidates = data.totalNumberOfCandidates;
    this.numberOfRecruiters = data.totalNumberOfRecruiters;
  }


  onGetAllCandidateSuccess(candidateProfile: any) {
    this.userData.candidate = candidateProfile.data.candidate;
    this.loaderService.stop();
  }

  onGetAllRecruiterSuccess(recruiterProfile: any) {
    this.userData.recruiter = recruiterProfile.data.recruiter;
    this.loaderService.stop();
  }

  loadUser(letter: string) {
    this.loaderService.start();
    this.adminDashboardService.getAllCandidates(letter)
      .subscribe(
        candidateProfile => this.onGetAllCandidateSuccess(candidateProfile),
        error => this.errorService.onError(error));

    this.adminDashboardService.getAllRecruiters(letter)
      .subscribe(
        recruiterProfile => this.onGetAllRecruiterSuccess(recruiterProfile),
        error => this.errorService.onError(error));
  }

}
