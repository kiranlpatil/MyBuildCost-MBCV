import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../shared/services/localstorage.service';
import { LocalStorage, AppSettings, NavigationRoutes } from '../shared/constants';
import { ThemeChangeService } from '../shared/services/themechange.service';
import { Message } from '../shared/models/message';
import { MessageService } from '../shared/services/message.service';

@Injectable()
export class RegistrationService {
  private error_msg: string;
  private isShowErrorMessage: boolean = true;
constructor(private _router: Router, private themeChangeService: ThemeChangeService, private messageService: MessageService){}

  onSuccess(res: any) {
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE, res.data.isCandidate);
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE_FILLED, res.data.isCompleted);
    LocalStorageService.setLocalValue(LocalStorage.END_USER_ID, res.data.end_user_id);
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID, res.data.email);
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, res.data.mobile_number);
    LocalStorageService.setLocalValue(LocalStorage.FIRST_NAME, res.data.first_name);
    LocalStorageService.setLocalValue(LocalStorage.LAST_NAME, res.data.last_name);
    if (res.data.current_theme) {
      LocalStorageService.setLocalValue(LocalStorage.MY_THEME, res.data.current_theme);
      this.themeChangeService.change(res.data.current_theme);
    }
    if (res.isSocialLogin) {
      LocalStorageService.setLocalValue(LocalStorage.IS_SOCIAL_LOGIN, AppSettings.IS_SOCIAL_LOGIN_YES);
    } else {
      LocalStorageService.setLocalValue(LocalStorage.IS_SOCIAL_LOGIN, AppSettings.IS_SOCIAL_LOGIN_NO);
    }
    LocalStorageService.setLocalValue(LocalStorage.PASSWORD, '');
    this.successRedirect(res);
  }

  successRedirect(res: any) {

    LocalStorageService.setLocalValue(LocalStorage.IS_LOGGED_IN, 1);
    LocalStorageService.setLocalValue(LocalStorage.PROFILE_PICTURE, res.data.picture);
    LocalStorageService.setLocalValue(LocalStorage.AFTER_RECRUITER_REGISTRATION_FORM, null);
    LocalStorageService.setLocalValue(LocalStorage.AFTER_CANDIDATE_REGISTRATION_FORM, null);
    if (res.data.isCandidate === true) {
      if (res.data.isCompleted === true) {
        this._router.navigate([NavigationRoutes.APP_CANDIDATE_DASHBOARD]);
      } else {
        this._router.navigate([NavigationRoutes.APP_CREATEPROFILE]);
      }
    } else {
      LocalStorageService.setLocalValue(LocalStorage.COMPANY_NAME, res.data.company_name);

      this._router.navigate([NavigationRoutes.APP_RECRUITER_DASHBOARD]);
    }
  }

  loginFail(error: any) {
    LocalStorageService.setLocalValue(LocalStorage.PASSWORD, '');
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
}
