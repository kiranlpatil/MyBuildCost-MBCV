import {  Component,Output,EventEmitter } from '@angular/core';
import {  JobInformation  } from '../model/job-information';

@Component({
  moduleId: module.id,
  selector: 'cn-job-information',
  templateUrl: 'job-information.component.html',
  styleUrls: ['job-information.component.css']
})

export class JobInformationComponent {
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
