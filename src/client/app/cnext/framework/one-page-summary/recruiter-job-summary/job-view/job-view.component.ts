import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { RecruiterDashboardService } from '../../../recruiter-dashboard/recruiter-dashboard.service';
import { JobSummary } from '../../../model/jobSummary';
import { Router } from '@angular/router';
import {NavigationRoutes} from '../../../../../framework/shared/constants';
import {ComplexityComponentService} from "../../../complexities/complexity.service";
import {JobCompareService} from "../../../single-page-compare-view/job-compare-view/job-compare-view.service";


@Component({
  moduleId: module.id,
  selector: 'cn-job-view',
  templateUrl: 'job-view.component.html',
  styleUrls: ['job-view.component.css'],

})
export class JobViewComponent implements OnChanges ,OnInit {
  @Input() jobId: string;
  @Input() calledFrom: string;
  private recruiter: JobSummary = new JobSummary();
  private capabilities : any;

  constructor(private recruiterDashboardService: RecruiterDashboardService,
              private complexityComponentService : ComplexityComponentService,
              private _router: Router,
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
            this.OnRecruiterDataSuccess(data.data.industry);
          });
    }
    if (changes.calledFrom !== undefined && changes.calledFrom.currentValue !== undefined) {
      this.calledFrom = changes.calledFrom.currentValue;
      console.log("In ngchange",this.calledFrom);
    }
  }

  OnRecruiterDataSuccess(data: any) {
    this.recruiter = data;
    this.getCapabilities();

  }

  getCapabilities() {
    if(this.recruiter && this.recruiter.postedJobs[0]){
      this.complexityComponentService.getCapabilityMatrix(this.recruiter.postedJobs[0]._id).subscribe(
        capa => {
          this.capabilities= this.jobCompareService.getStandardMatrix(capa.data);
        });
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
