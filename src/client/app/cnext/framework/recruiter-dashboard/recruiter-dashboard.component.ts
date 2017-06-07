import { Component, OnInit } from '@angular/core';
import { RecruiterDashboardService } from './recruiter-dashboard.service';
import { RecruiterDashboard } from '../model/recruiter-dashboard';
import { RecruiterHeaderDetails } from '../model/recuirterheaderdetails';
import { ActivatedRoute} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard',
  templateUrl: 'recruiter-dashboard.component.html',
  styleUrls: ['recruiter-dashboard.component.css']
})

export class RecruiterDashboardComponent implements OnInit {
  company_name: string;
/*  test : string="HI <p>helll</p> hiidhi<div>dssddsds</div>";*/
  private recruiterDashboard: RecruiterDashboard = new RecruiterDashboard();
  private recruiterHeaderDetails: RecruiterHeaderDetails = new RecruiterHeaderDetails();
  private tabName : string;
  private showTabsForJobPoster:boolean = false;

  constructor( private recruiterDashboardService: RecruiterDashboardService,
               private activatedRoute:ActivatedRoute) {
  }


  getRecruiterData() {
    this.recruiterDashboardService.getJobList()
      .subscribe(
        (data: any) => {
          this.recruiterDashboard = <RecruiterDashboard>data.data[0];
          this.recruiterHeaderDetails = <RecruiterHeaderDetails>data.jobCountModel;
        });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.tabName = params['id'];
      if(this.tabName === 'post_new_job') {
        let matcheElement: any = document.getElementById('post_job');
        matcheElement.click();
      }
    });
    this.getRecruiterData();
  }

}
