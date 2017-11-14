import { Component } from '@angular/core';
import { RecruiterDashboard } from '../model/recruiter-dashboard';

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard',
  templateUrl: 'recruiter-dashboard.component.html',
  styleUrls: ['recruiter-dashboard.component.css']
})

export class RecruiterDashboardComponent {
  company_name: string;
  recruiterDashboard: RecruiterDashboard = new RecruiterDashboard();

  constructor() {
  }
}
