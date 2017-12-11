import {Injectable} from "@angular/core";
import {CanActivate,Router} from "@angular/router";
import {LocalStorageService} from "./localstorage.service";
import {LocalStorage} from "../constants";

@Injectable()

export class AuthGuardService implements CanActivate {

  constructor(private _router: Router) {

  }

  canActivate():boolean {
    return this.validateLogin()
  }
  validateLogin() {
    if (parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGGED_IN)) === 1) {
      if (LocalStorageService.getLocalValue(LocalStorage.ACCESS_TOKEN)) {
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
