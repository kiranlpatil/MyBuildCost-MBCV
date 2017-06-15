import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {CandidateService} from "./candidate.service";
import {CandidateDetail} from "./candidate";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {AppSettings, CommonService, Message, MessageService, NavigationRoutes} from "../../shared/index";
import {ImagePath, LocalStorage} from "../../shared/constants";
import {LocalStorageService} from "../../shared/localstorage.service";
import {DateService} from "../../../cnext/framework/date.service";
import {Location} from "../location";
import {MyGoogleAddress} from "./google-our-place/my-google-address";
@Component({
  moduleId: module.id,
  selector: 'cn-candidate-registration',
  templateUrl: 'candidate.component.html',
  styleUrls: ['candidate.component.css'],
})

export class CandidateComponent implements OnInit {
  private model = new CandidateDetail();
  private storedLocation: Location = new Location();
  private isPasswordConfirm: boolean;
  private isFormSubmitted = false;
  private userForm: FormGroup;
  private error_msg: string;
  private isShowErrorMessage: boolean = true;
  private BODY_BACKGROUND: string;
  private passingYear: string;
  private validBirthYearList = new Array();
  private year: any;
  private currentDate: any;


  constructor(private commonService: CommonService, private _router: Router, private dateService: DateService,
              private candidateService: CandidateService, private messageService: MessageService, private formBuilder: FormBuilder) {

    this.userForm = this.formBuilder.group({
      'first_name': ['', ValidationService.requireFirstNameValidator],
      'last_name': ['', ValidationService.requireLastNameValidator],
      'mobile_number': ['', [ValidationService.requireMobileNumberValidator, ValidationService.mobileNumberValidator]],
      'email': ['', [ValidationService.requireEmailValidator, ValidationService.emailValidator]],
      'password': ['', [ValidationService.requirePasswordValidator, ValidationService.passwordValidator]],
      'confirm_password': ['', ValidationService.requireConfirmPasswordValidator],
      'birth_year': ['', [Validators.required, ValidationService.birthYearValidator]],
      'location': ['', Validators.required],
      'captcha': ['', Validators.required]
    });


    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear() - 18;
  }

  ngOnInit() {
    this.validBirthYearList = this.dateService.createBirthYearList(this.year);
  }


  selectYearModel(year: any) {
    this.passingYear = year;
    this.model.birth_year = year;
  }

  getAddress(address: MyGoogleAddress) {
    this.storedLocation.city = address.city;
    this.storedLocation.state = address.state;
    this.storedLocation.country = address.country;
  }

  onSubmit() {
    this.model = this.userForm.value;
    this.model.current_theme = AppSettings.LIGHT_THEM;
    this.model.isCandidate = true;
    this.model.location = this.storedLocation;
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
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, this.userForm.value.mobile_number);
    LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_registration');
    LocalStorageService.setLocalValue(LocalStorage.FROM_CANDIDATE_REGISTRATION, 'true');
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
    if (this.model.confirm_password !== this.model.password) {
      this.isPasswordConfirm = true;
      return true;
    } else {
      this.isPasswordConfirm = false;
      return false;
    }
  }

}
