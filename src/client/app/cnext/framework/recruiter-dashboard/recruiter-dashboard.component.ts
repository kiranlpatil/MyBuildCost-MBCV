
import {  Component,OnInit  } from '@angular/core';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';
import { LocalStorage } from '../../../framework/shared/constants';

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard',
  templateUrl: 'recruiter-dashboard.component.html',
  styleUrls: ['recruiter-dashboard.component.css']
})

export class RecruiterDashboardComponent implements  OnInit {
  company_name:string;
  image_path:string;
 /*constructor() {
  }*/
  ngOnInit() {
    this.company_name = LocalStorageService.getLocalValue(LocalStorage.COMPANY_NAME);
    this.image_path = LocalStorageService.getLocalValue(LocalStorage.PROFILE_PICTURE);
    console.log("Company logo",this.image_path);
  }




}
