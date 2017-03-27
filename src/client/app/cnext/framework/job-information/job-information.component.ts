
import {Component} from '@angular/core';
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage, NavigationRoutes} from "../../../framework/shared/constants";
import {Router} from "@angular/router";
import {DashboardService} from "../../../framework/dashboard/dashboard.service";
import {JobInformation} from "../model/job-information";


@Component({
  moduleId: module.id,
  selector: 'cn-job-information',
  templateUrl: 'job-information.component.html',
  styleUrls: ['job-information.component.css']
})

export class JobInformationComponent {
  private jobInformation=new JobInformation();
  protected jobTitle:string;
  protected hiringManger:string;
  protected department:string;

  constructor(private _router:Router) {
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
