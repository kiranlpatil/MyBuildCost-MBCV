import {AfterViewInit, Component, OnInit} from "@angular/core";
import {RecruiterDashboardService} from "./recruiter-dashboard.service";
import {RecruiterDashboard} from "../model/recruiter-dashboard";
import {RecruiterHeaderDetails} from "../model/recuirterheaderdetails";
import {ActivatedRoute, Router} from "@angular/router";
import {RedirectRecruiterDashboardService} from "../redirect-dashboard.service";
import {ErrorService} from "../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard',
  templateUrl: 'recruiter-dashboard.component.html',
  styleUrls: ['recruiter-dashboard.component.css']
})

export class RecruiterDashboardComponent implements OnInit, AfterViewInit {
  company_name: string;
  private recruiterDashboard: RecruiterDashboard = new RecruiterDashboard();
  private recruiterHeaderDetails: RecruiterHeaderDetails = new RecruiterHeaderDetails();
  private tabName: string;
  private jobId: string;
  private screenType: string='';

  constructor(private recruiterDashboardService: RecruiterDashboardService,
              private errorService:ErrorService,
              private activatedRoute: ActivatedRoute,private _router: Router,
              private redirectRecruiterDashboard: RedirectRecruiterDashboardService) {
    redirectRecruiterDashboard.showTest$.subscribe(
      isShow=> {
        let matchElement: any = document.getElementById('recr_job_dashboard');
        matchElement.click();
    });
  }


  getRecruiterData() {
    this.recruiterDashboardService.getJobList()
      .subscribe(
        (data: any) => {
          this.recruiterDashboard = <RecruiterDashboard>data.data[0];
          this.recruiterHeaderDetails = <RecruiterHeaderDetails>data.jobCountModel;
          if(this.recruiterDashboard !== undefined && this.recruiterDashboard.postedJobs !== undefined && this.recruiterDashboard.postedJobs.length>0) {
            this.screenType='jobList';
          } else {
            this.screenType='welcomescreen';
          }
        },error => this.errorService.onError(error));
  }

  ngOnInit() {
    this.getRecruiterData();
  }

  ngAfterViewInit() {
    this.activatedRoute.params.subscribe(params => {
      this.tabName = params['id'];
      if (this.tabName === 'post_new_job') {
          let matchElement: any = document.getElementById('post_job');
          matchElement.click();
      }
      if (this.tabName === 'applicant_search') {
        let matchElement:any = document.getElementById('applicant_search');
        matchElement.click();
      }
    });

  }

  navigateTo(nav: string) {
    if (nav !== undefined) {
      this._router.navigate([nav]);
    }
  }

  jobSelected(jobId: string) {
    this.jobId = jobId;
    let matchElement: any = document.getElementById('post_job');
    matchElement.click();
  }
}
