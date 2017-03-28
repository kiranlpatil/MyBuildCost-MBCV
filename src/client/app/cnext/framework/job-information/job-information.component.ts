
import {Component} from '@angular/core';
import {JobInformation} from "../model/job-information";


@Component({
  moduleId: module.id,
  selector: 'cn-job-information',
  templateUrl: 'job-information.component.html',
  styleUrls: ['job-information.component.css']
})

export class JobInformationComponent {
  private jobInformation=new JobInformation();

  constructor() {
  }


  ngOnInit(){


  }

  isJobTitleSelected(job:any){
    this.jobInformation.jobTitle=job;
  }

  isHiringMangerSelected(manager:any){
    this.jobInformation.hiringManager=manager;
  }

  isDepartmentSelected(department:any){
    this.jobInformation.department=department;
  }





}
