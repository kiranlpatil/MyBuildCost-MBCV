import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {SessionStorage, NavigationRoutes} from "../../../../shared/constants";
import {SessionStorageService} from "../../../../shared/services/session.service";
import {Candidate} from "../../../../user/models/candidate";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {ErrorService} from "../../../../shared/services/error.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-summary',
  templateUrl: 'candidate-summary.component.html',
  styleUrls: ['candidate-summary.component.css']
})

export class CandidateSummaryComponent implements OnInit {

  candidateId: string;
  candidate: Candidate = new Candidate();

  constructor(private _router: Router,
              private errorService:ErrorService,
              private profileCreatorService: CandidateProfileService) {
  }

  ngOnInit() {
    this.candidateId = SessionStorageService.getSessionValue(SessionStorage.END_USER_ID);
    this.getCandidateProfile(this.candidateId);
  }

  getCandidateProfile(candidateId: string) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidateId)
      .subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData),
        error => this.errorService.onError(error));
  }

  OnCandidateDataSuccess(candidateData: any) {
    this.candidate = candidateData.data;
    this.candidate.basicInformation = candidateData.metadata;
  }

  logOut() {
    window.sessionStorage.clear();
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
