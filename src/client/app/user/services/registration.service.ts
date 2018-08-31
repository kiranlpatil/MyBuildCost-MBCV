import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../shared/services/session.service';
import { SessionStorage, AppSettings, NavigationRoutes } from '../../shared/constants';
import { ThemeChangeService } from '../../shared/services/themechange.service';
import { Message } from '../../shared/models/message';
import { MessageService } from '../../shared/services/message.service';

@Injectable()
export class RegistrationService {
  private error_msg: string;
  private isShowErrorMessage: boolean = true;
constructor(private _router: Router, private themeChangeService: ThemeChangeService, private messageService: MessageService){ }

  onGetUserDataSuccess(res: any) {
    SessionStorageService.setSessionValue(SessionStorage.EMAIL_ID, res.data.email);
    SessionStorageService.setSessionValue(SessionStorage.MOBILE_NUMBER, res.data.mobile_number);
    SessionStorageService.setSessionValue(SessionStorage.FIRST_NAME, res.data.first_name);
    SessionStorageService.setSessionValue(SessionStorage.LAST_NAME, res.data.last_name);
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
  }

  successRedirect(res: any) {
    SessionStorageService.setSessionValue(SessionStorage.IS_LOGGED_IN, 1);
    SessionStorageService.setSessionValue(SessionStorage.IS_USER_SIGN_IN, 0);
    SessionStorageService.setSessionValue(SessionStorage.PROFILE_PICTURE, res.data.picture);
      //this._router.navigate([NavigationRoutes.APP_CREATE_NEW_PROJECT]);
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }

  onLoginFailure(error: any) {
    SessionStorageService.setSessionValue(SessionStorage.PASSWORD, '');
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
