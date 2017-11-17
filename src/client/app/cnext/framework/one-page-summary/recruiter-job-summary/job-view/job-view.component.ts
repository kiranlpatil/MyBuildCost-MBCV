import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { RecruiterDashboardService } from '../../../recruiter-dashboard/recruiter-dashboard.service';
import { JobSummary } from '../../../model/jobSummary';
import { Router } from '@angular/router';
import {NavigationRoutes} from '../../../../../shared/constants';
import {ComplexityComponentService} from "../../../complexities/complexity.service";
import {JobCompareService} from "../../../single-page-compare-view/job-compare-view/job-compare-view.service";
import {ErrorService} from "../../../../../shared/services/error.service";
import {JobPosterModel} from "../../../../../user/models/jobPoster";
import {Recruiter} from "../../../../../user/models/recruiter";


@Component({
  moduleId: module.id,
  selector: 'cn-job-view',
  templateUrl: 'job-view.component.html',
  styleUrls: ['job-view.component.css'],

})
export class JobViewComponent implements OnChanges ,OnInit {
  @Input() jobId: string;
  @Input() calledFrom: string;
  recruiter: Recruiter = new Recruiter();
  job: JobPosterModel = new JobPosterModel();
  capabilities : any;

  constructor(private recruiterDashboardService: RecruiterDashboardService,
              private complexityComponentService : ComplexityComponentService,
              private _router: Router,private errorService:ErrorService,
              private jobCompareService : JobCompareService) {
  }

  ngOnInit() {
    //this.calledFrom ='jobposter';
  }

  ngOnChanges(changes: any) {
    if (changes.jobId !== undefined && changes.jobId.currentValue !== undefined) {

      this.jobId = changes.jobId.currentValue;
      this.recruiterDashboardService.getPostedJobDetails(this.jobId)
        .subscribe(
          data => {
            this.OnRecruiterDataSuccess(data.result);
          },error => this.errorService.onError(error));
    }
    if (changes.calledFrom !== undefined && changes.calledFrom.currentValue !== undefined) {
      this.calledFrom = changes.calledFrom.currentValue;
    }
  }

  OnRecruiterDataSuccess(jobData: any) {
    this.getRecruiterDetails();
    this.job = jobData;
    this.getCapabilities();
  }

  getRecruiterDetails() {
    this.recruiterDashboardService.getRecruiterDetails()
      .subscribe(
        recruiterData => {
          this.recruiter = recruiterData.data;
        }, error => this.errorService.onError(error));
  }

  getCapabilities() {
    if(this.recruiter && this.job){
      this.complexityComponentService.getCapabilityMatrix(this.job._id).subscribe(
        capa => {
          this.capabilities= this.jobCompareService.getStandardMatrix(capa.data);
        },error => this.errorService.onError(error));
    }
  }

  goToDashboard() {
    this._router.navigate([NavigationRoutes.APP_RECRUITER_DASHBOARD]);
  }

  onJobClicked(item: any) {
    //this.jobEventEmitter.emit(item);
    this._router.navigate(['jobdashboard/', item]);
  }
}
