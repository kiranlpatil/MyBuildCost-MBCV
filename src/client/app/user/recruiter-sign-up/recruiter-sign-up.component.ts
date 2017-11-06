import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {Router} from "@angular/router";
import {RecruiterSignUpService} from "./recruiter-sign-up.service";
import {Recruiter} from "../models/recruiter";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {AppSettings, CommonService, Message, MessageService, NavigationRoutes} from "../../shared/index";
import {API, ImagePath, Label, LocalStorage, Messages} from "../../shared/constants";
import {LocalStorageService} from "../../shared/services/localstorage.service";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Location} from "../../user/models/location";
import {MyGoogleAddress} from "../../shared/models/my-google-address";
import {SharedService} from "../../shared/services/shared-service";
declare  var fbq:any;
declare  var gtag:any;


@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-registration',
  templateUrl: 'recruiter-sign-up.component.html',
  styleUrls: ['recruiter-sign-up.component.css'],
})

export class RecruiterSignUpComponent implements OnInit {

  @ViewChild('toaster') toaster: ElementRef;
  model = new Recruiter();
  private storedcompanySize: any;
  companySize: any;
  private companyHeadquarter: any;
  isPasswordConfirm: boolean;
  isCompanyWebsiteValid:boolean=true;
  private isFormSubmitted = false;
  recruiterForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  private BODY_BACKGROUND: string;
  private image_path: string;
  private isRecruitingForself: boolean = true;
  private isShowMessage: boolean = false;
  myPassword: string = '';
  storedLocation: Location = new Location();
  mainHeaderMenuHideShow: string;
  submitStatus: boolean;
  companySizeErrorMessage = Messages.MSG_ERROR_VALIDATION_COMPANYSIZE_REQUIRED;
  private locationValidationMessage: string = Messages.MSG_ERROR_VALIDATION_LOCATION_REQUIRED;
  private inValidLocationMessage: string = Messages.MSG_ERROR_VALIDATION_INVALID_LOCATION;
  private passwordMismatchMessage: string;
  formatted_address: string = 'Aurangabad, Bihar, India';
  companyHQCountry: string = '';
  isLocationInvalid: boolean = false;
  isLocationEmpty: boolean = false;
  isCompanyHQEmpty: boolean = false;
  isCompanyHQInvalid: boolean = false;
  private isValid: boolean = true;
  isChrome: boolean;
  isToasterVisible: boolean = true;

  constructor(private commonService: CommonService, private _router: Router, private http: Http,
              private recruiterService: RecruiterSignUpService, private messageService: MessageService,
              private formBuilder: FormBuilder, private sharedService: SharedService) {


    this.recruiterForm = this.formBuilder.group({
      'company_name': ['', [ValidationService.noWhiteSpaceValidator, ValidationService.requireCompanyNameValidator, ValidationService.nameValidator]],
      'company_size': ['', Validators.required],
      'company_website': [''],
      'mobile_number': ['', [ValidationService.requireMobileNumberValidator, ValidationService.mobileNumberValidator]],
      'email': ['', [ValidationService.requireEmailValidator, ValidationService.emailValidator]],
      'password': ['', [ValidationService.requirePasswordValidator, ValidationService.passwordValidator]],
      'confirm_password': ['', [ValidationService.requireConfirmPasswordValidator]],
      'location': ['', Validators.required],
      'company_headquarter_country': [''],
      'accept_terms': ['', Validators.required],

    });
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.image_path = ImagePath.PROFILE_IMG_ICON;
    this.isChrome = this.sharedService.getUserBrowser();
    this.isToasterVisible = this.sharedService.getToasterVisiblity();
    this.recruiterForm.controls['accept_terms'].setValue(false);
  }

  ngOnInit() {
    let val = LocalStorageService.getLocalValue(LocalStorage.AFTER_RECRUITER_REGISTRATION_FORM);
    if (val !== null) {
      if (val == "true") {
        this._router.navigate([NavigationRoutes.VERIFY_USER]);
      }
    }
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

  ngOnChanges(changes: any) {
    if (this.model && this.model.location) {
      if (this.model.location.city == undefined) {
        this.storedLocation.formatted_address = '';
      } else {
        this.storedLocation.formatted_address = this.model.location.city + ', ' + this.model.location.state + ', ' + this.model.location.country;
      }
    }
  }

  selectCompanySizeModel(size: string) {
    this.companySizeErrorMessage = undefined;
    this.storedcompanySize = size;
    this.recruiterForm.value.company_size = this.storedcompanySize;
    this.model.company_size = this.recruiterForm.value.company_size;
  }


  selectCompanyHeadquarterModel(address: MyGoogleAddress) {
    this.isCompanyHQInvalid = false;
    this.companyHeadquarter = address.country;
    this.recruiterForm.value.company_headquarter_country = this.companyHeadquarter;
    this.companyHQCountry = address.formatted_address;
  }

  getAddress(address: MyGoogleAddress) {
    this.isLocationInvalid = false;
    this.storedLocation.city = address.city;
    this.storedLocation.state = address.state;
    this.storedLocation.country = address.country;
    this.storedLocation.formatted_address = address.formatted_address;
  }

  keyDownCheck(e: any) {
    this.isLocationInvalid = false;
    this.isLocationEmpty = false;
    if (e.keyCode >= 65 && e.keyCode <= 90 || e.key == ',' || e.key == '13') {
      e.preventDefault();
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        this.storedLocation.formatted_address += e.key;
      }
    }
    else {
      return;
    }
  }

  keyDownCheckCompanyHQ(e: any) {
    this.isCompanyHQInvalid = false;
    this.isCompanyHQEmpty = false;
    if (e.keyCode >= 65 && e.keyCode <= 90 || e.key == ',' || e.key == '13') {
      e.preventDefault();
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        this.companyHQCountry += e.key;
      }
    }
    else {
      return;
    }
  }
  onCompanyWebsiteType() {
    this.isCompanyWebsiteValid=true;
  }
  onSubmit() {debugger
    this.isLocationInvalid = false;
    this.isLocationEmpty = false;
    this.isCompanyHQInvalid = false;
    this.isCompanyHQEmpty = false;
    this.model = this.recruiterForm.value;

        if( this.model.company_website===''||
      (this.model.company_website!=='' && this.model.company_website.match('[a-zA-Z0-9_\\-]+\\.[a-zA-Z0-9_\\-]+\\.[a-zA-Z0-9_\\-]'))) {
      this.isCompanyWebsiteValid = true;
    }else {
      this.isCompanyWebsiteValid=false;
    }
      if (this.model.company_name === '' || this.model.company_size == '' || this.model.mobile_number == '' ||
        this.model.email == '' || this.model.password == '' || this.model.confirm_password == '' ||
        this.storedLocation.formatted_address == '' || this.companyHQCountry == '' || !this.recruiterForm.controls['accept_terms'].value) {
        if (this.storedLocation.formatted_address == '') {
          this.isLocationEmpty = true;
        }
        if (this.companyHeadquarter == undefined || this.companyHQCountry == '') {
          this.isCompanyHQEmpty = true;
        }
        this.submitStatus = true;
        return;
      }

      if (!(this.storedLocation.formatted_address.split(',').length > 2)) {
        this.isLocationInvalid = true;
        return;
      }

      if (!(this.companyHQCountry.split(',').length > 2)) {
        this.isCompanyHQInvalid = true;
        return;
      }

      if (!this.recruiterForm.valid && this.isCompanyWebsiteValid) {
        return;
      }


      this.model.current_theme = AppSettings.LIGHT_THEM;
      this.model.location = this.storedLocation;
      this.model.isCandidate = false;
      this.model.company_headquarter_country = this.companyHeadquarter;
      this.model.isRecruitingForself = this.isRecruitingForself;
      this.model.email = this.model.email.toLowerCase();
      if (!this.makePasswordConfirm()) {
       fbq('track', 'CompleteRegistration');
       this.gtag_report_conversion('AW-831903917/QE2JCIuxrHcQrbHXjAM');

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
    LocalStorageService.setLocalValue(LocalStorage.AFTER_RECRUITER_REGISTRATION_FORM, "true");
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

  closeToaster() {
    this.isToasterVisible = false;
    this.sharedService.setToasterVisiblity(this.isToasterVisible);
  }

  getMessages() {
    return Messages;
  }

  getLabel() {
    return Label;
  }

  goToAcceptTerms() {
    let host = AppSettings.HTTP_CLIENT + window.location.hostname + API.ACCEPT_TERMS;
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
