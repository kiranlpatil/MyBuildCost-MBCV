import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {SessionStorage, NavigationRoutes} from "../../../../shared/constants";
import {SessionStorageService} from "../../../../shared/services/session.service";


@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-job-summary',
  templateUrl: 'recruiter-job-summary.component.html',
  styleUrls: ['recruiter-job-summary.component.css']
})

export class RecruiterJobSummaryComponent {
  jobId: string;

  constructor(private _router: Router) {
    this.jobId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_JOB_POSTED_ID);
  }

  logOut() {
    window.sessionStorage.clear();
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
