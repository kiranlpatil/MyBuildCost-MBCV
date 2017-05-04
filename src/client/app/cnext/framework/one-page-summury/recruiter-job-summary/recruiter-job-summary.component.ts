import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
//import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {Message} from "../../../../framework/shared/message";
import {MessageService} from "../../../../framework/shared/message.service";
//import {Candidate} from "../../model/candidate";
//import {CandidateDetail} from "../../../../framework/registration/candidate/candidate";
import {NavigationRoutes} from "../../../../framework/shared/constants";


@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-job-summary',
  templateUrl: 'recruiter-job-summary.component.html',
  styleUrls: ['recruiter-job-summary.component.css']
})

export class RecruiterJobSummaryComponent implements OnInit {

  constructor( private messageService:MessageService,
               private _router:Router) {
  }

  ngOnInit() {
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
