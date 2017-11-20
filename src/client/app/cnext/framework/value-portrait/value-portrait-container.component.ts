import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Button, Label, LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";


@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait-container',
  templateUrl: 'value-portrait-container.component.html',
  styleUrls: ['value-portrait-container.component.css'],
})

export class ValuePortraitContainerComponent implements OnInit {

  _userId:string;
  _jobId:string;
  isShareView:boolean = false;
  candidateName: string = 'candidate';
  private isCandidate: boolean;
  private isCandidateSubmitted: boolean;
  private isFromCreate: boolean = false;
  private isFromRecruiterJob: boolean = false;
  candidateId:string;
  constructor(private _router:Router, private activatedRoute:ActivatedRoute) {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
      this.candidateName = LocalStorageService.getLocalValue(LocalStorage.FIRST_NAME)+' '+ LocalStorageService.getLocalValue(LocalStorage.LAST_NAME);
    }
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE_SUBMITTED) === 'true') {
    this.isCandidateSubmitted = true;
    }
  }

  navigateTo() {
    var role = LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE);
    var isAdmin = LocalStorageService.getLocalValue(LocalStorage.ISADMIN);
    if(isAdmin) {
      this._router.navigate(['/admin_dashboard']);
    }
    if (role === 'true') {
      if(this.isFromCreate) {
        this.isFromCreate=false;
        this._router.navigate(['/candidate/profile']);
      }
      else {
        this._router.navigate(['/candidate/dashboard']);
      }
    }
    if (role === 'false') {
      this._router.navigate(['/recruiter/search', this.candidateId]);
    }

    if(this.isFromRecruiterJob) {
      this._router.navigate(['/recruiter/job', this._jobId]);
    }

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this._userId = params['id'];
      this.isFromCreate=false;
      if(params['jobId']) {
        this._jobId = params['jobId'];
        this.isFromRecruiterJob = true;
      }
    });
    this.activatedRoute.params.subscribe(params => {
      if(params['userId']){
        this.isFromCreate = true;
        this._userId = params['userId'];
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      var token = params['access_token'];
      if (token) {
        this.isShareView = true;
      }
    });

  }

  routeToSignUpPage() {
    this._router.navigate(['/applicant-signup','new_user']);
  }

  getLabel() {
    return Label;
  }

  getButtons() {
    return Button;
  }

  updateCanidateId(value:string) {
    this.candidateId = value;
  }
}
