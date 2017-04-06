import {  Component, OnInit, NgZone  } from '@angular/core';
import {  Router  } from '@angular/router';
import {  LoginService  } from './login.service';
import {  Login  } from './login';
import { Message,
  Messages,
  MessageService,
  NavigationRoutes,
  LocalStorage,
  LocalStorageService,
  AppSettings,
  CommonService,
  ThemeChangeService,
  ImagePath,
  LoaderService
 } from '../shared/index';
import {  FacebookService  } from './facebook.service';
import {  FormGroup, FormBuilder, Validators  } from '@angular/forms';
import {  ValidationService  } from '../shared/customvalidations/validation.service';
import {  FBToken  } from './fbtoken';
import {  GoogleToken  } from './googletoken';
import {  ProjectAsset  } from '../shared/constants';
//import { isBoolean } from 'util';

/// <reference path='../../../../../typings/globals/fbsdk/index.d.ts'/>
/// <reference path='../../../../../tools/manual_typings/project/googleplus.d.ts'/>

@Component({
  moduleId: module.id,
  selector: 'tpl-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})


export class LoginComponent implements OnInit {
  private model = new Login();
  private googleModel = new GoogleToken();
  private userForm:FormGroup;
  private error_msg:string;
  private isShowErrorMessage:boolean = true;
  //private status:boolean;
  private MY_LOGO_PATH:string;
  private EMAIL_ICON:string;
  private PASSWORD_ICON:string;
  private APP_NAME:string;
  private MY_TAG_LINE:string;
  private UNDER_LICENCE:string;
  private BODY_BACKGROUND:string;


  constructor(private _router:Router, private loginService:LoginService, private themeChangeService:ThemeChangeService,
              private messageService:MessageService, private _ngZone:NgZone,
              private formBuilder:FormBuilder, private commonService:CommonService, private loaderService:LoaderService,
              private _facebookService:FacebookService) {
    this.userForm = this.formBuilder.group({
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'password': ['', [Validators.required]]
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
    gapi.load('auth2',() => {
      var auth2 = gapi.auth2.init({
        client_id: '244363436693-l4fglqbjitj39t9dsg7lkep5esfoe1bq.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      auth2.attachClickHandler(document.getElementById('googleSignInButton'), {},
        (googleUser:any)=> {
         // var profile = googleUser.getBasicProfile();
          var googleToken = googleUser.Zi.id_token;
          this.setGoogleToken(googleToken);
         },
        (error:any)=> {
          this.googleError(error);
        }
      );
    });
    this._facebookService.loadAndInitFBSDK();
    if (parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGED_IN)) === 1) {
      this._router.navigate(['/create_profile']);
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

  loginSuccess(res:any) {
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE, res.data.isCandidate);
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
    if (navigateTo !== undefined ) {
      this._router.navigate([navigateTo]);
    }
  }


  successRedirect(res:any) {
    LocalStorageService.setLocalValue(LocalStorage.IS_LOGED_IN, 1);
    LocalStorageService.setLocalValue(LocalStorage.PROFILE_PICTURE,res.data.picture);
    if(res.data.isCandidate) {

      this._router.navigate([NavigationRoutes.APP_CREATEPROFILE]);
    } else {
      this._router.navigate([NavigationRoutes.APP_RECRUITER_DASHBOARD]);
    //  this._router.navigate([NavigationRoutes.APP_COMPANYDETAILS]);
    }
    var socialLogin:string = LocalStorageService.getLocalValue(LocalStorage.IS_SOCIAL_LOGIN);

    if(socialLogin === AppSettings.IS_SOCIAL_LOGIN_YES) {
      //window.location.reload(); //this will enable access to dropdown option oof profile.
    }
  }

  loginFail(error:any) {

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

  connectFacebook() {
    var self = this;
    FB.login((response:any) => {
     if (response.authResponse) {
     self._ngZone.run(() => {
     var fb = new FBToken();
     fb.token = response.authResponse.accessToken;
     this.setFBToken(fb.token);

     });
     } else {
     var message = new Message();
     message.isError = true;
     message.error_msg = Messages.MSG_ERROR_FB_AUTH;
     this.messageService.message(message);
     }
     }, {scope: 'public_profile, email', auth_type: 'rerequest'});
  }

  onFacebookLoginClick():void {
    var fb = new FBToken();
     FB.getLoginStatus(function (response:any) {
     if (response.status === 'connected') {
     fb.token = response.authResponse.accessToken;
     this.setFBToken(fb.token);
     } else {
     this.connectFacebook();
     }
     }.bind(this));
  }

 /* onGoogleLoginClick() {

     window.history.forward();
     gapi.load('auth2',() => {
     var auth2 = gapi.auth2.init({
     client_id: '244363436693-l4fglqbjitj39t9dsg7lkep5esfoe1bq.apps.googleusercontent.com',
     cookiepolicy: 'single_host_origin',
     scope: 'profile email'
     });
     auth2.attachClickHandler(document.getElementById('googleSignInButton'), {},
     (googleUser:any)=> {
     // var profile = googleUser.getBasicProfile();
     var googleToken = googleUser.Zi.id_token;
     console.log('googleToken: ' + googleToken);
     this.setGoogleToken(googleToken);
     },
     (error:any)=> {
     this.googleError(error);
     }
     );
     });
  }*/

  setFBToken(token:any) {
    this.loginService.setFBToken(token)
      .subscribe(
        res => (this.loginSuccess(res)),
        error => (this.loginFail(error)));
  }
 /* connectGoogleplus() {

  }*/

  /*loginWithGoogle(): void{
    var gptoken = new GoogleToken();
    FB.getLoginStatus(function (response:any) {
      this.connectGoogleplus();
    }.bind(this));
    alert('Please log in with google');
  }*/

  onSignUp() {
    this._router.navigate([NavigationRoutes.APP_REGISTRATION]);
  }

  onForgotPassword() {
    this._router.navigate([NavigationRoutes.APP_FORGOTPASSWORD]);
  }

  closeErrorMessage() {
    this.isShowErrorMessage = true;
  }
  setGoogleToken(googleToken:any) {
    this.googleModel.googleToken = googleToken;
    this.loginService.setGoogleToken(this.googleModel)
      .subscribe(
        res => (this.loginSuccess(res)),
        error => (this.loginFail(error)));
  }

  googleError(error:any) {
    var message = new Message();
    message.error_msg = error;
    message.isError = true;
    this.messageService.message(message);
  }

  onFailure(error:any) {
  console.log(error);
}
  /*renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': (googleUser:any)=>
    {
      var profile = googleUser.getBasicProfile();
      console.log('Email: ' + profile.getEmail());
      var googleToken = googleUser.getAuthResponse().id_token;
      //this.gtoken = googleToken;
      console.log('googleToken: ' + googleToken);
      var googleToken = googleUser.Zi.access_token;
      this.setGToken(googleToken);
    },
    'onfailure': this.onFailure
  });
}*/
  /*onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('Email: ' + profile.getEmail());
    var googleToken = googleUser.getAuthResponse().id_token;
    //this.gtoken = googleToken;
    console.log('googleToken: ' + googleToken);
    var googleToken = googleUser.Zi.access_token;
    this.setGToken(googleToken);
  }*/
}

