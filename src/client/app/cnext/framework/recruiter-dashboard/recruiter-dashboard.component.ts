import {Component, Input, OnInit} from "@angular/core";
import {RecruiterDashboard} from "../model/recruiter-dashboard";
import {SessionStorageService} from "../../../shared/services/session.service";
import {SessionStorage} from "../../../shared/constants";

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
    if(SessionStorageService.getSessionValue(SessionStorage.FROM_ADMIN) == 'true') {
      this.fromAdmin = true;
    }
  }
}
