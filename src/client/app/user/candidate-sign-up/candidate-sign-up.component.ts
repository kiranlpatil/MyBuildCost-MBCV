import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CandidateSignUpService} from "./candidate-sign-up.service";
import {CandidateDetail} from "../models/candidate-details";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {AppSettings, CommonService, Message, MessageService, NavigationRoutes} from "../../shared/index";
import {API, ImagePath, Label, LocalStorage, Messages} from "../../shared/constants";
import {LocalStorageService} from "../../shared/services/localstorage.service";
import {DateService} from "../../cnext/framework/date.service";
import {SharedService} from "../../shared/services/shared-service";
import {ErrorService} from "../../shared/services/error.service";
import {SessionStorageService} from "../../shared/services/session.service";
import {AnalyticService} from "../../shared/services/analytic.service";
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
  private isFormSubmitted = false;
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  private BODY_BACKGROUND: string;
  passingYear: string;
  validBirthYearList = new Array(0);
  mainHeaderMenuHideShow: string;
  private year: any;
  private currentDate: any;
  submitStatus: boolean;
  private birthYearErrorMessage: string;
  private passwordMismatchMessage: string;
  isChrome: boolean;
  isToasterVisible: boolean = true;
  isGuideMessageVisible: boolean = false;
  isFromCareerPlugin: boolean = false;

  constructor(private analyticService: AnalyticService, private commonService: CommonService, private _router: Router, private dateService: DateService,
              private candidateService: CandidateSignUpService, private messageService: MessageService, private formBuilder: FormBuilder,
              private sharedService: SharedService, private errorService: ErrorService, private activatedRoute: ActivatedRoute) {

    this.userForm = this.formBuilder.group({
      'first_name': ['', [ValidationService.requireFirstNameValidator]],
      'last_name': ['', [ValidationService.requireLastNameValidator]],
      'mobile_number': ['', [ValidationService.requireMobileNumberValidator, ValidationService.mobileNumberValidator]],
      'email': ['', [ValidationService.requireEmailValidator, ValidationService.emailValidator]],
      'password': ['', [ValidationService.passwordValidator]],
      'confirm_password': ['', ValidationService.requireConfirmPasswordValidator],
      'birth_year': ['', [ValidationService.birthYearValidator]],
      'accept_terms': ['', [Validators.required]],
    });

    this.analyticService.googleAnalyse(this._router);
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear() - 18;
    this.isChrome = this.sharedService.getUserBrowser();
    this.isToasterVisible = this.sharedService.getToasterVisiblity();
    console.log('isToasterVisible', this.isToasterVisible);
    this.userForm.controls['accept_terms'].setValue(false);
  }

  ngOnInit() {
    let val = LocalStorageService.getLocalValue(LocalStorage.AFTER_CANDIDATE_REGISTRATION_FORM);
    if (val !== null) {
      this._router.navigate([NavigationRoutes.VERIFY_USER]);
    }
    this.validBirthYearList = this.dateService.createBirthYearList(this.year);
    this.mainHeaderMenuHideShow = 'applicant';

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if(params['phoneNumber']) {
        this.userForm.controls['mobile_number']
          .setValue(Number(params['phoneNumber']))
      }
      if(params['integrationKey']) {
        SessionStorageService.setRecruiterReferenceId(params['integrationKey'])
      }
      this.isFromCareerPlugin = (params['integrationKey'] !== undefined) ? true : false;
    });
  }

  ngAfterViewInit() {
    this.activatedRoute.params.subscribe(params => {
      this.isGuideMessageVisible = params['id'] === 'new_user' ? true : false;
    });
  }

  closeToaster() {
    this.isToasterVisible = false;
    this.sharedService.setToasterVisiblity(this.isToasterVisible);
  }

  selectYearModel(year: any) {
    this.birthYearErrorMessage = undefined;
    if (year === '') {
      this.userForm.controls['birth_year'].setValue(undefined);
    }
    this.passingYear = year;
    this.model.birth_year = year;
  }

  onSubmit() {
    this.model = this.userForm.value;
    if (this.model.first_name === '' || this.model.last_name === '' || this.model.mobile_number === '' ||
      this.model.email === '' || this.model.password === '' || this.model.confirm_password === '' ||
      this.model.birth_year === undefined || !this.userForm.controls['accept_terms'].value) {
      if (this.model.birth_year === undefined) {
        this.birthYearErrorMessage = Messages.MSG_ERROR_VALIDATION_BIRTHYEAR_REQUIRED;
      }
      this.submitStatus = true;
      return;
    }

    if (!this.userForm.valid) {
      return;
    }

    this.model = this.userForm.value;
    this.model.first_name = this.model.first_name.trim();
    this.model.last_name = this.model.last_name.trim();
    this.model.current_theme = AppSettings.LIGHT_THEM;
    this.model.isCandidate = true;
    this.model.email = this.model.email.toLowerCase();
    if(SessionStorageService.getRecruiterReferenceId()) {
      this.model.recruiterReferenceId = SessionStorageService.getRecruiterReferenceId();
    }

    if (!this.makePasswordConfirm()) {
      this.isFormSubmitted = true;
      this.candidateService.addCandidate(this.model)
        .subscribe(
          candidate => this.onRegistrationSuccess(candidate),
          error => this.onRegistrationError(error));
    }
  }
  onRegistrationSuccess(candidate: any) {
    fbq('track', 'CompleteRegistration');
    this.gtag_report_conversion('AW-831903917/fTZvCPC1q3YQrbHXjAM');
    LocalStorageService.setLocalValue(LocalStorage.USER_ID, candidate.data._id);
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID, this.userForm.value.email);
    LocalStorageService.setLocalValue(LocalStorage.PASSWORD, this.model.password);
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, this.userForm.value.mobile_number);
    LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_registration');
    LocalStorageService.setLocalValue(LocalStorage.FROM_CANDIDATE_REGISTRATION, 'true');
    LocalStorageService.setLocalValue(LocalStorage.AFTER_CANDIDATE_REGISTRATION_FORM, 'true');
    this._router.navigate([NavigationRoutes.VERIFY_USER]);
  }

  onRegistrationError(error: any) {
    if (error.err_code === 404 || error.err_code === 0) {
      var message = new Message();
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;
    }
  }

  goBack() {
    this.commonService.goBack();
    this._router.navigate(['/']);
  }
  makePasswordConfirm(): boolean {
    if (this.model.confirm_password !== this.model.password && this.model.confirm_password !== '') {
      this.isPasswordConfirm = true;
      this.passwordMismatchMessage = Messages.MSG_ERROR_VALIDATION_PASSWORD_MISMATCHED;
      return true;
    } else {
      this.isPasswordConfirm = false;
      return false;
    }
  }

  getMessages() {
    return Messages;
  }
  getLabel() {
    return Label;
  }

  goToAcceptTerms() {
    let host = AppSettings.HTTP_CLIENT + AppSettings.HOST_NAME + API.ACCEPT_TERMS;
    window.open(host, '_blank');
  }
  gtag_report_conversion(sendTo:any) {
    var callback = function () {
       /*if (typeof(url) != 'undefined') {
         window.location = url;
       }*/
    };
    gtag('event', 'conversion', {
      'send_to': sendTo
    });
    return false;
  }
}
