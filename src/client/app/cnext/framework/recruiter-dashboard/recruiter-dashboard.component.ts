
import {  Component,OnInit  } from '@angular/core';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';
import {LocalStorage} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard',
  templateUrl: 'recruiter-dashboard.component.html',
  styleUrls: ['recruiter-dashboard.component.css']
})

export class RecruiterDashboardComponent implements  OnInit {
  company_name:string;
 /*constructor() {
  }*/
  ngOnInit() {
    this.company_name = LocalStorageService.getLocalValue(LocalStorage.COMPANY_NAME);
  }




}
