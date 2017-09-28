import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {LocalStorage, NavigationRoutes} from "../../../../shared/constants";
import {LocalStorageService} from "../../../../shared/services/localstorage.service";


@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-job-summary',
  templateUrl: 'recruiter-job-summary.component.html',
  styleUrls: ['recruiter-job-summary.component.css']
})

export class RecruiterJobSummaryComponent {
  jobId: string;

  constructor(private _router: Router) {
    this.jobId = LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID);
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
