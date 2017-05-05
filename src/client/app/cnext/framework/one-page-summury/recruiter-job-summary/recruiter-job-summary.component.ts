import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NavigationRoutes} from "../../../../framework/shared/constants";
import {JobPosterModel} from "../../model/jobPoster";
import {Recruiter} from "../../../../framework/registration/recruiter/recruiter";
import {RecruiterDashboardService} from "../../recruiter-dashboard/recruiter-dashboard.service";


@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-job-summary',
  templateUrl: 'recruiter-job-summary.component.html',
  styleUrls: ['recruiter-job-summary.component.css']
})

export class RecruiterJobSummaryComponent implements OnInit {

  private jobDetail:JobPosterModel=new JobPosterModel();
  private recruiter:Recruiter=new Recruiter();
  private secondaryCapabilities:string[]=new Array();

  constructor(private _router:Router,
              private recruiterDashboardService: RecruiterDashboardService) {
  }

  ngOnInit() {
    this.recruiterDashboardService.getJobList()
      .subscribe(
        data => {
         this.OnRecruiterDataSuccess(data.data[0])
        });
  }
  
  OnRecruiterDataSuccess(data:any) {
    this.recruiter = data;
    this.getSecondaryData();
  }
  
  getSecondaryData(){
    for(let role of this.jobDetail.industry.roles){
      for(let capability of role.capabilities){
        if(capability.isSecondary){
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
