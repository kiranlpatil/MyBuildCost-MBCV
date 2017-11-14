import {Injectable} from "@angular/core";
import {CanActivate,Router} from "@angular/router";
import {LocalStorageService} from "../../shared/services/localstorage.service";
import {LocalStorage, NavigationRoutes} from "../../shared/constants";


@Injectable()

export class LoginauthGuard implements CanActivate {

  constructor(private _router: Router) {

  }

  canActivate():boolean {
   return this.validateLogin()
  }
  validateLogin() {
    if (parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGGED_IN)) === 1) {
      if (LocalStorageService.getLocalValue(LocalStorage.ISADMIN) === 'true') {
        this._router.navigate([NavigationRoutes.APP_ADMIN_DASHBOARD]);
      } else {
        if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
          if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE_SUBMITTED) === 'true') {
            this._router.navigate([NavigationRoutes.APP_CANDIDATE_DASHBOARD]);
          } else {
            this._router.navigate([NavigationRoutes.APP_CREATEPROFILE]);
          }
        } else if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'false') {
          this._router.navigate([NavigationRoutes.APP_RECRUITER_DASHBOARD]);
        }
      }
      return false;
    } else {
      LocalStorageService.setLocalValue(LocalStorage.IS_LOGGED_IN, 0);
      return true;
    }
  }
}
