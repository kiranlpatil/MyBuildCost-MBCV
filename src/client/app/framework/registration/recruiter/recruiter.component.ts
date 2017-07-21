import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {RecruiterService} from "./recruiter.service";
import {Recruiter} from "./recruiter";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {AppSettings, CommonService, Message, MessageService, NavigationRoutes} from "../../shared/index";
import {ImagePath, LocalStorage, Messages} from "../../shared/constants";
import {LocalStorageService} from "../../shared/localstorage.service";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Location} from "../location";
import {MyGoogleAddress} from "../candidate/google-our-place/my-google-address";


@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-registration',
  templateUrl: 'recruiter.component.html',
  styleUrls: ['recruiter.component.css'],
})

export class RecruiterComponent implements OnInit {
  private model = new Recruiter();
  private storedcompanySize: any;
  private companySize: any;
  private companyHeadquarter: any;
  private isPasswordConfirm: boolean;
  private isFormSubmitted = false;
  private recruiterForm: FormGroup;
  private error_msg: string;
  private isShowErrorMessage: boolean = true;
  private BODY_BACKGROUND: string;
  private image_path: string;
  private isRecruitingForself: boolean = true;
  private isShowMessage: boolean = false;
  private myPassword: string = '';
  private storedLocation: Location = new Location();
  private mainHeaderMenuHideShow: string;
  private submitStatus: boolean;
  private companySizeErrorMessage = Messages.MSG_ERROR_VALIDATION_COMPANYSIZE_REQUIRED;
  private locationErrorMessage: string;
  private companyHQErrorMessage: string;
  private passwordMismatchMessage: string;

  constructor(private commonService: CommonService, private _router: Router, private http: Http,
              private recruiterService: RecruiterService, private messageService: MessageService, private formBuilder: FormBuilder) {


    this.recruiterForm = this.formBuilder.group({
      'company_name': ['', [ValidationService.noWhiteSpaceValidator, ValidationService.requireCompanyNameValidator]],
      'company_size': ['', Validators.required],
      'mobile_number': ['', [ValidationService.requireMobileNumberValidator, ValidationService.mobileNumberValidator]],
      'email': ['', [ValidationService.requireEmailValidator, ValidationService.emailValidator]],
      'password': ['', [ValidationService.requirePasswordValidator, ValidationService.passwordValidator]],
      'confirm_password': ['', [ValidationService.requireConfirmPasswordValidator]],
      'location': ['', Validators.required],
      'company_headquarter_country': [''],
      //'captcha': ['', Validators.required]

    });
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.image_path = ImagePath.PROFILE_IMG_ICON;
  }

  ngOnInit() {
    this.model = this.recruiterForm.value;
    this.mainHeaderMenuHideShow = 'recruiter';
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = 'companysize';
    this.http.get(url, options)
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.companySize = data.companysize;
        },
        err => console.error(err),
        () => console.log()
      );

  }

  selectCompanySizeModel(size: string) {
    this.companySizeErrorMessage = undefined;
    this.storedcompanySize = size;
    this.recruiterForm.value.company_size = this.storedcompanySize;
    this.model.company_size = this.recruiterForm.value.company_size;
  }


  selectCompanyHeadquarterModel(address: MyGoogleAddress) {
    this.companyHQErrorMessage = undefined;
    this.companyHeadquarter = address.country;
    this.recruiterForm.value.company_headquarter_country = this.companyHeadquarter;
  }

  getAddress(address: MyGoogleAddress) {
    this.locationErrorMessage = undefined;
    this.storedLocation.city = address.city;
    this.storedLocation.state = address.state;
    this.storedLocation.country = address.country;
  }

  onSubmit() {
    this.model = this.recruiterForm.value;
    if (this.model.company_name === '' || this.model.company_size == '' || this.model.mobile_number == '' ||
      this.model.email == '' || this.model.password == '' || this.model.confirm_password == '' ||
      this.storedLocation == null || this.companyHeadquarter == undefined) {
      if (this.storedLocation.city == undefined) {
        this.locationErrorMessage = Messages.MSG_ERROR_VALIDATION_LOCATION_REQUIRED;
      }
      if (this.companyHeadquarter == undefined) {
        this.companyHQErrorMessage = Messages.MSG_ERROR_VALIDATION_HEADQUARTER_REQUIRED;
      }
      this.submitStatus = true;
      return;
    }

    if (!this.recruiterForm.valid) {
      return
    }
    this.model.current_theme = AppSettings.LIGHT_THEM;
    this.model.location = this.storedLocation;
    this.model.isCandidate = false;
    this.model.company_headquarter_country = this.companyHeadquarter;
    this.model.isRecruitingForself = this.isRecruitingForself;
    this.model.email = this.model.email.toLowerCase();
    if (!this.makePasswordConfirm()) {
      this.isFormSubmitted = true;
      this.recruiterService.addRecruiter(this.model)
        .subscribe(
          user => this.onRegistrationSuccess(user),
          error => this.onRegistrationError(error));
    }
  }

  onRegistrationSuccess(user: any) {
    LocalStorageService.setLocalValue(LocalStorage.USER_ID, user.data._id);
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID, this.recruiterForm.value.email);
    LocalStorageService.setLocalValue(LocalStorage.COMPANY_NAME, this.recruiterForm.value.company_name);
    LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_registration');
    LocalStorageService.setLocalValue(LocalStorage.FROM_CANDIDATE_REGISTRATION, 'false');
    this._router.navigate([NavigationRoutes.VERIFY_USER]);
  }

  onRegistrationError(error: any) {
    if (error.err_code === 404 || error.err_code === 0) {
      var message = new Message();
      message.error_msg = error.message;
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
      this.passwordMismatchMessage = Messages.MSG_ERROR_VALIDATION_PASSWORD_MISMATCHED;
      this.isPasswordConfirm = true;
      return true;
    } else {
      this.isPasswordConfirm = false;
      return false;
    }
  }

  showMessage() {
    this.isShowMessage = false;
  }

  selectPassword(newval: any) {
    if (this.myPassword.match(/(?=.*\d)(?=.*[a-z])(?=.*[$@#_!%*?&])(?=.*[A-Z]).{8,}/)) {

      this.isShowMessage = false;
    }
  }

  recruitmentForOthers() {
    this.isRecruitingForself = false;
  }

  recruitmentForSelf() {
    this.isRecruitingForself = true;
  }
}
