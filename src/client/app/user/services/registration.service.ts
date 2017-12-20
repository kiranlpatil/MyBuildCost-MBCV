import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {SessionStorageService} from "../../shared/services/session.service";
import {SessionStorage, AppSettings, NavigationRoutes} from "../../shared/constants";
import {ThemeChangeService} from "../../shared/services/themechange.service";
import {Message} from "../../shared/models/message";
import {MessageService} from "../../shared/services/message.service";

@Injectable()
export class RegistrationService {
  private error_msg: string;
  private isShowErrorMessage: boolean = true;
constructor(private _router: Router, private themeChangeService: ThemeChangeService, private messageService: MessageService){}

  onSuccess(res: any) {
    SessionStorageService.setSessionValue(SessionStorage.IS_CANDIDATE, res.data.isCandidate);
    SessionStorageService.setSessionValue(SessionStorage.IS_CANDIDATE_FILLED, res.data.isCompleted);
    SessionStorageService.setSessionValue(SessionStorage.IS_CANDIDATE_SUBMITTED, res.data.isSubmitted);
    SessionStorageService.setSessionValue(SessionStorage.END_USER_ID, res.data.end_user_id);
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
    SessionStorageService.setSessionValue(SessionStorage.PASSWORD, '');
    this.successRedirect(res);
  }

  successRedirect(res: any) {

    SessionStorageService.setSessionValue(SessionStorage.IS_LOGGED_IN, 1);
    SessionStorageService.setSessionValue(SessionStorage.PROFILE_PICTURE, res.data.picture);
    SessionStorageService.setSessionValue(SessionStorage.AFTER_RECRUITER_REGISTRATION_FORM, null);
    SessionStorageService.setSessionValue(SessionStorage.AFTER_CANDIDATE_REGISTRATION_FORM, null);
    SessionStorageService.setSessionValue(SessionStorage.ISADMIN, res.data.isAdmin);
    if (res.data.isAdmin === true) {
      this._router.navigate([NavigationRoutes.APP_ADMIN_DASHBOARD]);
    }
    else if (res.data.isCandidate === true) {
      if (res.data.isCompleted === true) {
        this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
      } else {
        this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
      }
    } else {
      SessionStorageService.setSessionValue(SessionStorage.COMPANY_NAME, res.data.company_name);

      this._router.navigate([NavigationRoutes.APP_RECRUITER_DASHBOARD]);
    }
  }

  loginFail(error: any) {
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
