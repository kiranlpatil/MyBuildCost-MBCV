import {Component, Input, OnInit} from "@angular/core";
import {RecruiterDashboard} from "../model/recruiter-dashboard";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {LocalStorage} from "../../../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard',
  templateUrl: 'recruiter-dashboard.component.html',
  styleUrls: ['recruiter-dashboard.component.css']
})

export class RecruiterDashboardComponent implements OnInit {
  company_name: string;
  recruiterDashboard: RecruiterDashboard = new RecruiterDashboard();// todo take this with jobs for meta data --abhijeet
  @Input() jobs: string[] = new Array(0);
  screenType: string='';
  fromAdmin: boolean = false;

  constructor() {
  }

  ngOnInit() {
    if(LocalStorageService.getLocalValue(LocalStorage.FROM_ADMIN) == 'true') {
      this.fromAdmin = true;
    }
  }
}
