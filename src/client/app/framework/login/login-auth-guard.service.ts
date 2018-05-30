import {Injectable} from "@angular/core";
import {CanActivate,Router} from "@angular/router";
import {SessionStorageService} from "../../shared/services/session.service";
import {SessionStorage, NavigationRoutes} from "../../shared/constants";


@Injectable()

export class LoginauthGuard implements CanActivate {

  constructor(private _router: Router) {

  }

  canActivate():boolean {
   return this.validateLogin();
  }
  validateLogin() {
    return true;
  }
}
