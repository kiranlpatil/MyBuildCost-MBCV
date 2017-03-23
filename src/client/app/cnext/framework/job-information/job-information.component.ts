
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
  private jobTitle:string;
  private hiringManger:string;
  private department:string;

  constructor(private _router:Router) {
  }


  ngOnInit(){


  }

  isJobTitleSelected(value:any){
    this.jobInformation.jobTitle=this.jobTitle;
  }

  ishiringMangerSelected(value:any){
    this.jobInformation.hiringManager=this.hiringManger;
  }

  ishiringMangerSelected(value:any){
    this.jobInformation.department=this.department;
  }





}
