import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NavigationRoutes} from "../../../../framework/shared/constants";
import {RecruiterDashboardService} from "../../recruiter-dashboard/recruiter-dashboard.service";
import {JobSummary} from "../../model/jobSummary";


@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-job-summary',
  templateUrl: 'recruiter-job-summary.component.html',
  styleUrls: ['recruiter-job-summary.component.css']
})

export class RecruiterJobSummaryComponent implements OnInit {


  private recruiter:JobSummary=new JobSummary();
  private secondaryCapabilities: string[] = new Array();


  constructor(private _router: Router,
              private recruiterDashboardService: RecruiterDashboardService) {
  }

  ngOnInit() {
    this.recruiterDashboardService.getPostedJobDetails()
      .subscribe(
        data => {
          this.OnRecruiterDataSuccess(data.data.industry)
        });
  }

  OnRecruiterDataSuccess(data: any) {
    this.recruiter = data;
    this.getSecondaryData();

  }

  getSecondaryData() {
    for (let role of this.recruiter.postedJobs[0].industry.roles) {
      for (let capability of role.capabilities) {
        if (capability.isSecondary) {
          this.secondaryCapabilities.push(capability.name);
        }
      }
    }
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
