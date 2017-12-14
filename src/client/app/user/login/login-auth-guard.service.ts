import {Injectable} from "@angular/core";
import {CanActivate,Router} from "@angular/router";
import {SessionStorageService} from "../../shared/services/session.service";
import {SessionStorage, NavigationRoutes} from "../../shared/constants";


@Injectable()

export class LoginauthGuard implements CanActivate {

  constructor(private _router: Router) {

  }

  canActivate():boolean {
   return this.validateLogin()
  }
  validateLogin() {
    if (parseInt(SessionStorageService.getSessionValue(SessionStorage.IS_LOGGED_IN)) === 1) {
      if (SessionStorageService.getSessionValue(SessionStorage.ISADMIN) === 'true') {
        this._router.navigate([NavigationRoutes.APP_ADMIN_DASHBOARD]);
      } else {
        if (SessionStorageService.getSessionValue(SessionStorage.IS_CANDIDATE) === 'true') {
          if (SessionStorageService.getSessionValue(SessionStorage.IS_CANDIDATE_SUBMITTED) === 'true') {
            this._router.navigate([NavigationRoutes.APP_CANDIDATE_DASHBOARD]);
          } else {
            this._router.navigate([NavigationRoutes.APP_CREATEPROFILE]);
          }
        } else if (SessionStorageService.getSessionValue(SessionStorage.IS_CANDIDATE) === 'false') {
          this._router.navigate([NavigationRoutes.APP_RECRUITER_DASHBOARD]);
        }
      }
      return false;
    } else {
      SessionStorageService.setSessionValue(SessionStorage.IS_LOGGED_IN, 0);
      return true;
    }
  }
}
