import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {SessionStorageService} from "../shared/services/session.service";
import {SessionStorage} from "../shared/constants";

@Injectable()

export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router){}

  canActivate(): boolean {
    return this.validateAdmin();
  }

  validateAdmin():boolean {
    if (parseInt(SessionStorageService.getSessionValue(SessionStorage.IS_LOGGED_IN)) === 1) {
      if (SessionStorageService.getSessionValue(SessionStorage.ISADMIN) === 'true') {
        return true;
      } else {
        this.router.navigate(['/signin']);
        return false;
      }
    } else {
      this.router.navigate(['/signin']);
      return false;
    }

  }

}
