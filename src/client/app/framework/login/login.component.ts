import {Component, NgZone, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {LoginService} from "./login.service";
import {Login} from "./login";
import {
  AppSettings,
  CommonService,
  ImagePath,
  LoaderService,
  LocalStorage,
  LocalStorageService,
  Message,
  MessageService,
  NavigationRoutes,
  ThemeChangeService
} from "../shared/index";
import {FacebookService} from "./facebook.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ValidationService} from "../shared/customvalidations/validation.service";
import {ProjectAsset} from "../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'tpl-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})


export class LoginComponent implements OnInit {
  private model = new Login();
  private userForm: FormGroup;
  private error_msg: string;
  private isShowErrorMessage: boolean = true;
  private MY_LOGO_PATH: string;
  private EMAIL_ICON: string;
  private PASSWORD_ICON: string;
  private APP_NAME: string;
  private MY_TAG_LINE: string;
  private UNDER_LICENCE: string;
  private BODY_BACKGROUND: string;


  constructor(private _router: Router, private loginService: LoginService, private themeChangeService: ThemeChangeService,
              private messageService: MessageService, private _ngZone: NgZone,
              private formBuilder: FormBuilder, private commonService: CommonService, private loaderService: LoaderService,
              private _facebookService: FacebookService) {
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
  }

  ngOnInit() {
    window.history.forward();
    if (parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGGED_IN)) === 1) {
      this._router.navigate([NavigationRoutes.APP_CANDIDATE_DASHBOARD]);
    }
  }

  onSubmit() {

    this.model = this.userForm.value;
    this.model.email = this.model.email.toLowerCase();
    this.loginService.userLogin(this.model)
      .subscribe(
        res => (this.loginSuccess(res)),
        error => (this.loginFail(error)));
  }

  loginSuccess(res: any) {
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE, res.data.isCandidate);
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE_FILLED, res.data.isCompleted);
    LocalStorageService.setLocalValue(LocalStorage.END_USER_ID, res.data.end_user_id);
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID, res.data.email);
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, res.data.mobile_number);
    LocalStorageService.setLocalValue(LocalStorage.FIRST_NAME, res.data.first_name);
    LocalStorageService.setLocalValue(LocalStorage.LAST_NAME, res.data.last_name);
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

  navigateTo(navigateTo: string) {
    if (navigateTo !== undefined) {
      this._router.navigate([navigateTo]);
    }
  }


  successRedirect(res: any) {
    LocalStorageService.setLocalValue(LocalStorage.IS_LOGGED_IN, 1);
    LocalStorageService.setLocalValue(LocalStorage.PROFILE_PICTURE, res.data.picture);
    if (res.data.isCandidate === true) {
      if (res.data.isCompleted === true) {
        this._router.navigate([NavigationRoutes.APP_CANDIDATE_DASHBOARD]);
      }
      else {
        this._router.navigate([NavigationRoutes.APP_CREATEPROFILE]);
      }
    } else {
      LocalStorageService.setLocalValue(LocalStorage.COMPANY_NAME, res.data.company_name);

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
    console.log(error);
  }

}

