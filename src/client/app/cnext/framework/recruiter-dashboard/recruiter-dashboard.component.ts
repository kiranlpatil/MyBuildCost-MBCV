import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RecruiterDashboardService } from './recruiter-dashboard.service';
import { RecruiterDashboard } from '../model/recruiter-dashboard';
import { RecruiterHeaderDetails } from '../model/recuirterheaderdetails';
import { ActivatedRoute, Router } from '@angular/router';
import { RedirectRecruiterDashboardService } from '../../../user/services/redirect-dashboard.service';
import { ErrorService } from '../../../shared/services/error.service';
import { Messages } from '../../../shared/constants';
import { MessageService } from '../../../shared/services/message.service';
import { Message } from '../../../shared/models/message';
import {RenewJobPostService} from "../../../user/services/renew-jobpost.service";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard',
  templateUrl: 'recruiter-dashboard.component.html',
  styleUrls: ['recruiter-dashboard.component.css']
})

export class RecruiterDashboardComponent implements OnInit, AfterViewInit {
  company_name: string;
  recruiterDashboard: RecruiterDashboard = new RecruiterDashboard();
  private recruiterHeaderDetails: RecruiterHeaderDetails = new RecruiterHeaderDetails();
  private tabName: string;
  private jobId: string;
  screenType: string='';
  private selectedJobProfile: string;


  constructor(private recruiterDashboardService: RecruiterDashboardService,
              private errorService:ErrorService,
              private activatedRoute: ActivatedRoute,private _router: Router,
              private redirectRecruiterDashboard: RedirectRecruiterDashboardService,
              private messageService: MessageService,
              private renewJobPostService: RenewJobPostService) {
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
          for(let postedJob of this.recruiterDashboard.postedJobs) {
            let currentDate = Number(new Date());
            let expiringDate = Number(new Date(postedJob.expiringDate));
            let daysRemainingForExpiring = Math.round(Number(new Date(expiringDate - currentDate))/(1000*60*60*24));
            postedJob.daysRemainingForExpiring = daysRemainingForExpiring;
            console.log('daysRemaining',postedJob._id + this.recruiterDashboard.postedJobs);
          }
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
      if( params['jobid']) {
        this.jobId = params['jobid'];
        this.jobSelected( params['jobid']);
        let message = new Message();
        message.custom_message=Messages.MSG_MSG_CLONED_SUCCESSFULLY;
        this.messageService.message(message);
        let matchElement: any = document.getElementById('post_job');
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
  OnCloneSuccessMessage()  {
    let message = new Message();
    message.custom_message=Messages.MSG_MSG_CLONED_SUCCESSFULLY;
    this.messageService.message(message);
    this.getRecruiterData();
  }
  getMessage() {
    return Messages;
  }

  checkJobPostExpiryDate(selectedJobProfile: string) {
    this.renewJobPostService.checkJobPostExpiryDate(selectedJobProfile);
    this.getRecruiterData();
  }

}
