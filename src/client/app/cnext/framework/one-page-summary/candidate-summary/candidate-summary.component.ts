import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {LocalStorage, NavigationRoutes} from "../../../../shared/constants";
import {LocalStorageService} from "../../../../shared/services/localstorage.service";
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
    this.candidateId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
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
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
