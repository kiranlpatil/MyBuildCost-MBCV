import {Injectable} from "@angular/core";
import {CanActivate,Router} from "@angular/router";
import {SessionStorageService} from "./session.service";
import {LocalStorage, SessionStorage} from "../constants";
import {LocalStorageService} from "./localstorage.service";

@Injectable()

export class AuthGuardService implements CanActivate {

  constructor(private _router: Router) {

  }

  canActivate():boolean {
    return this.validateLogin();
  }
  validateLogin() {
    if (parseInt(SessionStorageService.getSessionValue(SessionStorage.IS_LOGGED_IN)) === 1) {
      if (SessionStorageService.getSessionValue(SessionStorage.ACCESS_TOKEN)) {
        return true;
      } else {
        this._router.navigate(['/signin']);
        return false;
      }
    } else {
      this._router.navigate(['/signin']);
      return false;
    }
  }
}
