import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {LoginService} from "./login.service";
import {Login} from "../models/login";
import {
  AppSettings,
  ImagePath,
  LocalStorage,
  LocalStorageService,
  Message,
  MessageService,
  NavigationRoutes,
  ThemeChangeService
} from "../../shared/index";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {Messages, ProjectAsset} from "../../shared/constants";
import {SharedService} from "../../shared/services/shared-service";
/*declare var CareerPluginLoad:any;*/

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})

export class LoginComponent implements OnInit {
  @ViewChild('toaster') toaster: ElementRef;
  private model = new Login();
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  private MY_LOGO_PATH: string;
  private EMAIL_ICON: string;
  private PASSWORD_ICON: string;
  private APP_NAME: string;
  private MY_TAG_LINE: string;
  private UNDER_LICENCE: string;
  private BODY_BACKGROUND: string;
  submitStatus: boolean;
  mainHeaderMenuHideShow: string;
  isChrome: boolean;
  isToasterVisible: boolean = true;
  constructor(private _router: Router, private loginService: LoginService, private themeChangeService: ThemeChangeService,
              private messageService: MessageService, private formBuilder: FormBuilder, private sharedService: SharedService) {
    this.userForm = this.formBuilder.group({
      'email': ['', [ValidationService.requireEmailValidator, ValidationService.emailValidator]],
      'password': ['', [ValidationService.requirePasswordValidator]]
    });
    this.MY_LOGO_PATH = ImagePath.MY_WHITE_LOGO;
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.MY_TAG_LINE = ProjectAsset.TAG_LINE;
    this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
    this.EMAIL_ICON = ImagePath.EMAIL_ICON;
    this.PASSWORD_ICON = ImagePath.PASSWORD_ICON;
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.isChrome = this.sharedService.getUserBrowser();
    this.isToasterVisible = this.sharedService.getToasterVisiblity();
  }

  ngOnInit() {
    this.mainHeaderMenuHideShow = 'signin';
    window.history.forward();
    //this._validateUserNavigation.validate();
   /* var docLoad = new CareerPluginLoad();
    docLoad.loadCareerPluginScript();*/
  }

  closeToaster() {
    this.isToasterVisible = false;
    this.sharedService.setToasterVisiblity(this.isToasterVisible);
  }

  onSubmit() {
    this.model = this.userForm.value;
    if (this.model.email == '' || this.model.password == '') {
      this.submitStatus = true;
      return;
    }

    if (!this.userForm.valid) {
      return
    }

    this.model.email = this.model.email.toLowerCase();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.currentPosition.bind(this), this.locationError.bind(this));
    }
    window.scrollTo(0,0);
  }

  loginSuccess(res: any) {
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE, res.data.isCandidate);
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE_FILLED, res.data.isCompleted);
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE_SUBMITTED,  res.data.isSubmitted);
    LocalStorageService.setLocalValue(LocalStorage.END_USER_ID, res.data.end_user_id);
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID, res.data.email);
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, res.data.mobile_number);
    LocalStorageService.setLocalValue(LocalStorage.FIRST_NAME, res.data.first_name);
    LocalStorageService.setLocalValue(LocalStorage.LAST_NAME, res.data.last_name);
    if (res.data.guide_tour) {
      LocalStorageService.setLocalValue(LocalStorage.GUIDED_TOUR, JSON.stringify(res.data.guide_tour));
    } else {
      var dataArray: string[] = new Array(0);
      LocalStorageService.setLocalValue(LocalStorage.GUIDED_TOUR, JSON.stringify(dataArray));
    }

    this.userForm.reset();
    if (res.data.current_theme) {
      LocalStorageService.setLocalValue(LocalStorage.MY_THEME, res.data.current_theme);
      this.themeChangeService.change(res.data.current_theme);
    }
    if (res.isSocialLogin) {
      LocalStorageService.setLocalValue(LocalStorage.IS_SOCIAL_LOGIN, AppSettings.IS_SOCIAL_LOGIN_YES);
    } else {
      LocalStorageService.setLocalValue(LocalStorage.IS_SOCIAL_LOGIN, AppSettings.IS_SOCIAL_LOGIN_NO);
    }
    this.successRedirect(res);
  }

  currentPosition(position: any) {
    this.model.latitude = position.coords.latitude;
    this.model.longitude = position.coords.longitude;
    this.loginService.userLogin(this.model)
      .subscribe(
        res => (this.loginSuccess(res)),
        error => (this.loginFail(error)));
  }

  locationError(error: any) {
    this.loginService.userLogin(this.model)
      .subscribe(
        res => (this.loginSuccess(res)),
        error => (this.loginFail(error)));
    console.log("location access is disable");
  }

  navigateTo(navigateTo: string) {
    if (navigateTo !== undefined) {
      this._router.navigate([navigateTo]);
    }
  }


  successRedirect(res: any) {
    LocalStorageService.setLocalValue(LocalStorage.IS_LOGGED_IN, 1);
    LocalStorageService.setLocalValue(LocalStorage.PROFILE_PICTURE, res.data.picture);
    LocalStorageService.setLocalValue(LocalStorage.ISADMIN, res.data.isAdmin);
    if (res.data.isAdmin === true) {
      this._router.navigate([NavigationRoutes.APP_ADMIN_DASHBOARD]);
    }
    else if (res.data.isCandidate === true) {
      if (res.data.isSubmitted === true) {
        this._router.navigate([NavigationRoutes.APP_CANDIDATE_DASHBOARD]);
      } else {
        this._router.navigate([NavigationRoutes.APP_CREATEPROFILE]);
      }
    } else {
      LocalStorageService.setLocalValue(LocalStorage.COMPANY_NAME, res.data.company_name);
      LocalStorageService.setLocalValue(LocalStorage.IS_RECRUITING_FOR_SELF, res.data.isRecruitingForself);
      this._router.navigate([NavigationRoutes.APP_RECRUITER_DASHBOARD]);
    }
  }

  loginFail(error: any) {

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

  onSignUp() {
    this._router.navigate([NavigationRoutes.APP_REGISTRATION]);
  }

  onForgotPassword() {
    this._router.navigate([NavigationRoutes.APP_FORGOTPASSWORD]);
  }

  onFailure(error: any) {
  }

  getMessages() {
    return Messages;
  }

}

