import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoginService } from './login.service';
import { Login } from '../../user/models/login';
import {
  AppSettings,
  ImagePath,
  SessionStorage,
  SessionStorageService,
  Message,
  MessageService,
  NavigationRoutes,
  ThemeChangeService
} from '../../shared/index';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../shared/customvalidations/validation.service';
import { Label, LocalStorage, Messages, ProjectAsset } from '../../shared/constants';
import { SharedService } from '../../shared/services/shared-service';
import { RegistrationService } from '../../user/services/registration.service';
import { LocalStorageService } from './../../shared/services/local-storage.service';
import { LoaderService } from '../../shared/loader/loaders.service';
//import { DeviceUUID } from 'device_uuid';
@Component({
  moduleId: module.id,
  selector: 'tpl-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})

export class LoginComponent implements OnInit {
  @ViewChild('toaster') toaster: ElementRef;
  //deviceDetails = DeviceUUID().parse();
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  submitStatus: boolean;
  mainHeaderMenuHideShow: string;
  isChrome: boolean;
  isToasterVisible: boolean = true;
  isFromCareerPlugin: boolean = false;
  recruiterReferenceId: string;
  isRememberPassword: boolean = false;
  private MY_LOGO_PATH: string;
  private EMAIL_ICON: string;
  private PASSWORD_ICON: string;
  private APP_NAME: string;
  private MY_TAG_LINE: string;
  private UNDER_LICENCE: string;
  private BODY_BACKGROUND: string;
  private model = new Login();

  constructor(private _router: Router, private loginService: LoginService, private themeChangeService: ThemeChangeService,
              private messageService: MessageService, private formBuilder: FormBuilder,
              private sharedService: SharedService, private activatedRoute: ActivatedRoute,
              private registrationService:RegistrationService, private loaderService: LoaderService) {
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
    //window.history.forward();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['email'] !== undefined) {
        this.userForm.controls['email'].setValue(params['email']);
      }
      if(parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGGED_IN))===1) {

        this.userForm.controls['email'].setValue(SessionStorageService.getSessionValue(SessionStorage.EMAIL_ID));
        this.userForm.controls['password'].setValue(SessionStorageService.getSessionValue(SessionStorage.PASSWORD));
        this.isRememberPassword=true;
      }else {
        this.isRememberPassword=false;
      }

      this.recruiterReferenceId = params['integrationKey'];
      this.isFromCareerPlugin = (params['integrationKey'] !== undefined) ? true : false;
    });



    if(LocalStorageService.getLocalValue(LocalStorage.ACCESS_TOKEN)) {
      this.getUserData();
    }
  }

  getUserData() {
    this.loginService.getUserData()
      .subscribe(
        data => {
          this.registrationService.onGetUserDataSuccess(data);
        }, error => { this.registrationService.onLoginFailure(error);}
      );
  }

  onSubmit() {
    this.model = this.userForm.value;
    if (this.model.email === '' || this.model.password === '') {
      this.submitStatus = true;
      return;
    }

    if (!this.userForm.valid) {
      return;
    }

    this.model.email = this.model.email.toLowerCase();
    this.loginService.userLogin(this.model)
      .subscribe(
        res => (this.onUserLoginSuccess(res)),
        error => (this.onUserLoginFailure(error)));
  }
  onUserLoginSuccess(res: any) {
    this.loaderService.start();
    if(this.isRememberPassword) {
      LocalStorageService.setLocalValue(LocalStorage.ACCESS_TOKEN, res.access_token);
      LocalStorageService.setLocalValue(LocalStorage.IS_LOGGED_IN, 1);
      LocalStorageService.setLocalValue(LocalStorage.FIRST_NAME, res.data.first_name);
      SessionStorageService.setSessionValue(SessionStorage.PASSWORD, this.model.password);
    } else {
      LocalStorageService.setLocalValue(LocalStorage.IS_LOGGED_IN, 0);
    }
    SessionStorageService.setSessionValue(SessionStorage.EMAIL_ID, res.data.email);
    SessionStorageService.setSessionValue(SessionStorage.MOBILE_NUMBER, res.data.mobile_number);
    SessionStorageService.setSessionValue(SessionStorage.COMPANY_NAME, res.data.company_name);
    SessionStorageService.setSessionValue(SessionStorage.FIRST_NAME, res.data.first_name);
    SessionStorageService.setSessionValue(SessionStorage.SELECTED_AREA,null);
    SessionStorageService.setSessionValue(SessionStorage.SELECTED_UNIT,null);

    this.userForm.reset();
    if (res.data.current_theme) {
      SessionStorageService.setSessionValue(SessionStorage.MY_THEME, res.data.current_theme);
      this.themeChangeService.change(res.data.current_theme);
    }
    if (res.isSocialLogin) {
      SessionStorageService.setSessionValue(SessionStorage.IS_SOCIAL_LOGIN, AppSettings.IS_SOCIAL_LOGIN_YES);
    } else {
      SessionStorageService.setSessionValue(SessionStorage.IS_SOCIAL_LOGIN, AppSettings.IS_SOCIAL_LOGIN_NO);
    }
    this.successRedirect(res);
    // this.userTrack(res);
  }

/*  userTrack(res: any) {
    this.deviceDetails.deviceId = new DeviceUUID().get();
    this.deviceDetails.email = res.data.email;
    this.deviceDetails.mobileNumber = res.data.mobile_number;
    this.deviceDetails.appType = 'MyBuildCost';
    this.deviceDetails.userId = SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    this.loginService.userTrack(this.deviceDetails)
      .subscribe(
        res => (this.onUserTrackSuccess(res)),
        error => (this.onUserTrackFailure(error)));
  }*/

  onUserTrackSuccess(res:any) {
    console.log('success');
  }

  onUserTrackFailure(err: any) {
    console.log('failure');
  }

  onUserLoginFailure(error: any) {

    if (error.err_code === 404 || error.err_code === 401 ||error.err_code === 0 ||error.err_code===500) {
      var message = new Message();
      message.error_msg = error.err_msg;
      message.error_code = error.err_code;
      message.isError = true;

      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;
    }
  }

  successRedirect(res: any) {
    SessionStorageService.setSessionValue(SessionStorage.IS_LOGGED_IN, 1);
    SessionStorageService.setSessionValue(SessionStorage.IS_USER_SIGN_IN, 1);
    SessionStorageService.setSessionValue(SessionStorage.IS_JUST_LOGGED_IN, 1);
    SessionStorageService.setSessionValue(SessionStorage.PROFILE_PICTURE, res.data.picture);
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }

  onSignUp() {
    this._router.navigate([NavigationRoutes.APP_REGISTRATION]);
  }

  onForgotPassword() {
    this._router.navigate([NavigationRoutes.APP_FORGOTPASSWORD, {email: this.userForm.value.email}]);
  }

  OnRememberPassword(event: any) {
    if(event.target.checked) {
      this.isRememberPassword = true;
    } else {
      this.isRememberPassword = false;
    }
  }

  getMessages() {
    return Messages;
  }

  getLabel() {
    return Label;
  }

}

