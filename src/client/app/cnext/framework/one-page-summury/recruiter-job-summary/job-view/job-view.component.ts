import {Component, Input} from "@angular/core";
import {RecruiterDashboardService} from "../../../recruiter-dashboard/recruiter-dashboard.service";
import {JobSummary} from "../../../model/jobSummary";


@Component({
  moduleId: module.id,
  selector: 'cn-job-view',
  templateUrl: 'job-view.component.html',
  styleUrls: ['job-view.component.css'],

})
export class JobViewComponent {
  @Input() jobId: string;
  private recruiter: JobSummary = new JobSummary();
  private secondaryCapabilities: string[] = new Array();


  constructor(private recruiterDashboardService: RecruiterDashboardService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes.jobId != undefined && changes.jobId.currentValue != undefined) {

      this.jobId = changes.jobId.currentValue;
      this.recruiterDashboardService.getPostedJobDetails(this.jobId)
        .subscribe(
          data => {
            this.OnRecruiterDataSuccess(data.data.industry)
          });
    }
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

}
