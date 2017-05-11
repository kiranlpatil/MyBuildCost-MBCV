import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {CandidateService} from "./candidate.service";
import {CandidateDetail} from "./candidate";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {Message, MessageService, CommonService, NavigationRoutes, AppSettings} from "../../shared/index";
import {ImagePath, LocalStorage, ValueConstant} from "../../shared/constants";
import {LocalStorageService} from "../../shared/localstorage.service";
import {LoaderService} from "../../shared/loader/loader.service";
import {Http, Response} from "@angular/http";
import {DateService} from "../../../cnext/framework/date.service";
import {  Location  } from '../location';
@Component({
  moduleId: module.id,
  selector: 'cn-candidate-registration',
  templateUrl: 'candidate.component.html',
  styleUrls: ['candidate.component.css'],
})

export class CandidateComponent implements OnInit {
  private model = new CandidateDetail();
  private storedLoaction:Location=new Location();
  private isPasswordConfirm: boolean;
  private isFormSubmitted = false;
  private userForm: FormGroup;
  private error_msg: string;
  private isShowErrorMessage: boolean = true;
  private BODY_BACKGROUND: string;
  private passingyear: string;
  private validBirthYearList = new Array();
  private year: any;
  private currentDate: any;


  constructor(private commonService: CommonService, private _router: Router, private dateservice: DateService,
              private candidateService: CandidateService, private messageService: MessageService, private formBuilder: FormBuilder) {

    this.userForm = this.formBuilder.group({
      'first_name': ['',ValidationService.requireFirstNameValidator],
      'last_name': ['',ValidationService.requireLastNameValidator],
      'mobile_number': ['',[ValidationService.requireMobileNumberValidator, ValidationService.mobileNumberValidator]],
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
    this.validBirthYearList = this.dateservice.createBirthYearList(this.year);
  }


  selectYearModel(newval: any) {
    this.passingyear = newval;
    this.model.birth_year = newval;
  }

  getAddress(event :any){
    this.storedLoaction.city= event.address_components[event.address_components.length - 3].long_name;
    this.storedLoaction.state=event.address_components[event.address_components.length - 2].long_name;
    this.storedLoaction.country=event.address_components[event.address_components.length - 1].long_name;
  }

  onSubmit() {
    this.model = this.userForm.value;
    this.model.current_theme = AppSettings.LIGHT_THEM;
    this.model.isCandidate = true;
    this.model.location = this.storedLoaction;
    console.log(this.model);
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
