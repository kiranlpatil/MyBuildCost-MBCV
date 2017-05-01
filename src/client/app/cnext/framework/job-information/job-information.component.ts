import {  Component,Output,EventEmitter,Input } from '@angular/core';
import {  JobInformation  } from '../model/job-information';
import {JobPosterModel} from "../model/jobPoster";

@Component({
  moduleId: module.id,
  selector: 'cn-job-information',
  templateUrl: 'job-information.component.html',
  styleUrls: ['job-information.component.css']
})

export class JobInformationComponent {
  @Input() jobPosterModel:JobPosterModel = new JobPosterModel();
  @Output() selectJobInformation=new EventEmitter();
  private jobInformation=new JobInformation();
  
  isJobTitleSelected(job:any) {
    this.jobInformation.jobTitle=job;
    this.selectJobInformation.emit(this.jobInformation);
  }

  isHiringMangerSelected(manager:any) {
    this.jobInformation.hiringManager=manager;
    this.selectJobInformation.emit(this.jobInformation);
  }

  isDepartmentSelected(department:any) {
    this.jobInformation.department=department;
    this.selectJobInformation.emit(this.jobInformation);
  }
}
