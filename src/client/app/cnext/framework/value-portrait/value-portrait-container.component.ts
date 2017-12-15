import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Button, Label, SessionStorage, LocalStorage} from "../../../shared/constants";
import {SessionStorageService} from "../../../shared/services/session.service";
import {ActionOnQCardService} from "../../../user/services/action-on-q-card.service";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {RegistrationService} from "../../../user/services/registration.service";
import {LoginService} from "../../../user/login/login.service";
import {ThemeChangeService} from "../../../shared/services/themechange.service";
import {ErrorService} from "../../../shared/services/error.service";


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
  type:string;
  constructor(private _router:Router, private activatedRoute:ActivatedRoute,
  private actionOnQCardService: ActionOnQCardService, private loginService: LoginService,
              private errorService: ErrorService) {
    if (SessionStorageService.getSessionValue(SessionStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
      this.candidateName = SessionStorageService.getSessionValue(SessionStorage.FIRST_NAME)+' '+ SessionStorageService.getSessionValue(SessionStorage.LAST_NAME);
    }
    if (SessionStorageService.getSessionValue(SessionStorage.IS_CANDIDATE_SUBMITTED) === 'true') {
    this.isCandidateSubmitted = true;
    }
  }

  navigateTo() {
    var role = SessionStorageService.getSessionValue(SessionStorage.IS_CANDIDATE);
    var isAdmin = SessionStorageService.getSessionValue(SessionStorage.ISADMIN);
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
        this.type = params['type'];
        this.actionOnQCardService.setJobId(this._jobId, this.type);
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

    if(LocalStorageService.getLocalValue(LocalStorage.ACCESS_TOKEN)) {
      if(this.isFromRecruiterJob && this.type === undefined) {
        this.getUserData();
      }
    }

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

  getUserData() {
    this.loginService.getUserData()
      .subscribe(
        data => {
          this.onSuccess(data);
        }, error => { this.errorService.onError(error)}
      );
  }

  onSuccess(res: any) {
    SessionStorageService.setSessionValue(SessionStorage.IS_CANDIDATE, res.data.isCandidate);
    SessionStorageService.setSessionValue(SessionStorage.IS_CANDIDATE_FILLED, res.data.isCompleted);
    SessionStorageService.setSessionValue(SessionStorage.IS_CANDIDATE_SUBMITTED, res.data.isSubmitted);
    SessionStorageService.setSessionValue(SessionStorage.END_USER_ID, res.data.end_user_id);
    SessionStorageService.setSessionValue(SessionStorage.EMAIL_ID, res.data.email);
    SessionStorageService.setSessionValue(SessionStorage.MOBILE_NUMBER, res.data.mobile_number);
    SessionStorageService.setSessionValue(SessionStorage.FIRST_NAME, res.data.first_name);
    SessionStorageService.setSessionValue(SessionStorage.LAST_NAME, res.data.last_name);
    SessionStorageService.setSessionValue(SessionStorage.PASSWORD, '');
    SessionStorageService.setSessionValue(SessionStorage.IS_LOGGED_IN, 1);
  }

}
