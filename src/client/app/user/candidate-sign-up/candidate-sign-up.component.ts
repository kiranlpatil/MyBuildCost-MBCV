import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {CandidateSignUpService} from "./candidate-sign-up.service";
import {CandidateDetail} from "../models/candidate-details";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {AppSettings, CommonService, Message, MessageService, NavigationRoutes} from "../../shared/index";
import {ImagePath, LocalStorage, Messages} from "../../shared/constants";
import {LocalStorageService} from "../../shared/services/localstorage.service";
import {DateService} from "../../cnext/framework/date.service";
import {SharedService} from "../../shared/services/shared-service";
@Component({
  moduleId: module.id,
  selector: 'cn-candidate-registration',
  templateUrl: 'candidate-sign-up.component.html',
  styleUrls: ['candidate-sign-up.component.css'],
})

export class CandidateSignUpComponent implements OnInit, AfterViewInit {

  @ViewChild('toaster') toaster: ElementRef;
  yearMatchNotFoundMessage: string = Messages.MSG_YEAR_NO_MATCH_FOUND;
  private model = new CandidateDetail();
  private isPasswordConfirm: boolean;
  private isFormSubmitted = false;
  private userForm: FormGroup;
  private error_msg: string;
  private isShowErrorMessage: boolean = true;
  private BODY_BACKGROUND: string;
  private passingYear: string;
  private validBirthYearList = new Array(0);
  private mainHeaderMenuHideShow: string;
  private year: any;
  private currentDate: any;
  private submitStatus: boolean;
  private birthYearErrorMessage: string;
  private passwordMismatchMessage: string;
  private isChrome: boolean;
  private isToasterVisible: boolean = true;
  private isGuideMessageVisible: boolean = false;

  constructor(private commonService: CommonService, private _router: Router, private dateService: DateService,
              private candidateService: CandidateSignUpService, private messageService: MessageService, private formBuilder: FormBuilder,
              private sharedService: SharedService, private activatedRoute: ActivatedRoute) {

    this.userForm = this.formBuilder.group({
      'first_name': ['', [ValidationService.requireFirstNameValidator, ValidationService.noWhiteSpaceValidator, ValidationService.nameValidator]],
      'last_name': ['', [ValidationService.requireLastNameValidator, ValidationService.noWhiteSpaceValidator, ValidationService.nameValidator]],
      'mobile_number': ['', [ValidationService.requireMobileNumberValidator, ValidationService.mobileNumberValidator]],
      'email': ['', [ValidationService.requireEmailValidator, ValidationService.emailValidator]],
      'password': ['', [ValidationService.requirePasswordValidator, ValidationService.passwordValidator]],
      'confirm_password': ['', ValidationService.requireConfirmPasswordValidator],
      'birth_year': ['', [Validators.required, ValidationService.birthYearValidator]],
    });


    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear() - 18;
    this.isChrome = this.sharedService.getUserBrowser();
    this.isToasterVisible = this.sharedService.getToasterVisiblity();
    console.log('isToasterVisible', this.isToasterVisible);
  }

  ngOnInit() {
    let val = LocalStorageService.getLocalValue(LocalStorage.AFTER_CANDIDATE_REGISTRATION_FORM);
    if (val !== null) {
      this._router.navigate([NavigationRoutes.VERIFY_USER]);
    }
    this.validBirthYearList = this.dateService.createBirthYearList(this.year);
    this.mainHeaderMenuHideShow = 'applicant';
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
      this.model.birth_year === undefined) {
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
    this.model.current_theme = AppSettings.LIGHT_THEM;
    this.model.isCandidate = true;
    this.model.email = this.model.email.toLowerCase();

    if (!this.makePasswordConfirm()) {

      this.isFormSubmitted = true;
      this.candidateService.addCandidate(this.model)
        .subscribe(
          candidate => this.onRegistrationSuccess(candidate),
          error => this.onRegistrationError(error));
    }
  }

  onRegistrationSuccess(candidate: any) {
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

}
