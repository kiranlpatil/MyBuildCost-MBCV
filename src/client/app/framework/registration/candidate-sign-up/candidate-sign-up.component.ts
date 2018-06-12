import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CandidateSignUpService } from './candidate-sign-up.service';
import { CandidateDetail } from './../../../user/models/candidate-details';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../shared/customvalidations/validation.service';
import { AppSettings, CommonService, Message, MessageService, NavigationRoutes } from '../../../shared/index';
import { API, ImagePath, Label, SessionStorage,Messages} from '../../../shared/constants';
import { SessionStorageService } from '../../../shared/services/session.service';
import { SharedService } from '../../../shared/services/shared-service';
import { ErrorService } from '../../../shared/services/error.service';
import { AnalyticService } from '../../../shared/services/analytic.service';
import { Login } from '../../../user/models/login';
import { LoginService } from '../../../framework/login/login.service';
import { RegistrationService } from '../../../user/services/registration.service';

declare  var fbq:any;
declare  var gtag:any;

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-registration',
  templateUrl: 'candidate-sign-up.component.html',
  styleUrls: ['candidate-sign-up.component.css'],
})

export class CandidateSignUpComponent implements OnInit, AfterViewInit {

  @ViewChild('toaster') toaster: ElementRef;
  yearMatchNotFoundMessage: string = Messages.MSG_YEAR_NO_MATCH_FOUND;
  model = new CandidateDetail();
  isPasswordConfirm: boolean;
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  passingYear: string;
  validBirthYearList = new Array(0);
  mainHeaderMenuHideShow: string;
  submitStatus: boolean;
  isChrome: boolean;
  isToasterVisible: boolean = true;
  isGuideMessageVisible: boolean = false;
  isFromCareerPlugin: boolean = false;

  private isFormSubmitted = false;
  private BODY_BACKGROUND: string;
  private MY_LOGO: string;
  private loginModel:Login;

 constructor(private analyticService: AnalyticService, private commonService: CommonService, private _router: Router,
              private candidateService: CandidateSignUpService, private messageService: MessageService,
             private formBuilder: FormBuilder, private sharedService: SharedService, private errorService: ErrorService,
             private activatedRoute: ActivatedRoute,
              private loginService : LoginService, private registrationService : RegistrationService) {

    this.userForm = this.formBuilder.group({
      'first_name': ['', [ValidationService.requireFirstNameValidator]],
      'email': ['', [ValidationService.requireEmailValidator, ValidationService.emailValidator]],
      'password': ['', [ValidationService.passwordValidator]],
    });
    this.loginModel = new Login();
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.MY_LOGO = ImagePath.MY_WHITE_LOGO;
  }

  ngOnInit() {
    this.mainHeaderMenuHideShow = 'applicant';
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if(params['phoneNumber']) {
        this.userForm.controls['mobile_number']
          .setValue(Number(params['phoneNumber']));
      }
    });
  }

  ngAfterViewInit() {
    this.activatedRoute.params.subscribe(params => {
      this.isGuideMessageVisible = params['id'] === 'new_user' ? true : false;
    });
  }

  onSubmit() {
    this.model = this.userForm.value;
    if (this.model.first_name === '' || this.model.email === '' || this.model.password === '' ) {
      this.submitStatus = true;
      return;
    }

    if (!this.userForm.valid) {
      return;
    }

    this.model = this.userForm.value;
    this.model.first_name = this.model.first_name.trim();
    this.model.current_theme = AppSettings.LIGHT_THEM;
    this.model.isCandidate = true;
    this.model.isActivated = true;
    this.model.email = this.model.email.toLowerCase();

    this.isFormSubmitted = true;
    this.candidateService.addCandidate(this.model)
      .subscribe(
        candidate => this.onRegistrationSuccess(candidate),
        error => this.onRegistrationFalure(error));

  }

  onRegistrationSuccess(candidate: any) {
    /*fbq('track', 'CompleteRegistration');
    this.gtag_report_conversion('AW-831903917/fTZvCPC1q3YQrbHXjAM');*/

    SessionStorageService.setSessionValue(SessionStorage.USER_ID, candidate.data._id);
    if(candidate.data.company_name) {
      SessionStorageService.setSessionValue(SessionStorage.COMPANY_NAME, candidate.data.company_name);
    }
    SessionStorageService.setSessionValue(SessionStorage.EMAIL_ID, this.userForm.value.email);
    SessionStorageService.setSessionValue(SessionStorage.PASSWORD, this.model.password);
    SessionStorageService.setSessionValue(SessionStorage.CHANGE_MAIL_VALUE, 'from_registration');
    this.navigateToDashboard();
  }

  navigateToDashboard() {
    this.loginModel.email = SessionStorageService.getSessionValue(SessionStorage.EMAIL_ID);
    this.loginModel.password = SessionStorageService.getSessionValue(SessionStorage.PASSWORD);
    this.loginService.userLogin(this.loginModel)
      .subscribe(
        (res:any) => (this.registrationService.onGetUserDataSuccess(res)),
        (error:any) => (this.registrationService.onLoginFailure(error)));
  }

  onRegistrationFalure(error: any) {
    if (error.err_code === 404 || error.err_code === 0||error.err_code===500) {
      var message = new Message();
      message.error_msg = error.err_msg;
      message.error_code =  error.err_code;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;
    }
  }

  goToSignIn() {
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }

  getMessages() {
    return Messages;
  }
  getLabel() {
    return Label;
  }


  gtag_report_conversion(sendTo:any) {
    gtag('event', 'conversion', {
      'send_to': sendTo
    });
    return false;
  }
}
