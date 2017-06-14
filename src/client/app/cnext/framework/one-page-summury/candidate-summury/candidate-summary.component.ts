import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {LocalStorage, NavigationRoutes} from "../../../../framework/shared/constants";
import {LocalStorageService} from "../../../../framework/shared/localstorage.service";
import {Candidate} from "../../model/candidate";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-summary',
  templateUrl: 'candidate-summary.component.html',
  styleUrls: ['candidate-summary.component.css']
})

export class CandidateSummaryComponent implements OnInit {

  private candidateId: string;
  private candidate: Candidate = new Candidate();

  constructor(private _router: Router, private profileCreatorService: CandidateProfileService) {
  }

  ngOnInit() {
    this.candidateId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
    this.getCandidateProfile(this.candidateId);
  }

  getCandidateProfile(candidateId: string) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidateId)
      .subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData));
  }

  OnCandidateDataSuccess(candidateData: any) {
    this.candidate = candidateData.data;
    this.candidate.basicInformation = candidateData.metadata;
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
