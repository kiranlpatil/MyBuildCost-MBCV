import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {LocalStorageService} from "../shared/services/localstorage.service";
import {LocalStorage} from "../shared/constants";

@Injectable()

export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router){}

  canActivate(): boolean {
    return this.validateAdmin();
  }

  validateAdmin():boolean {
    if (parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGGED_IN)) === 1) {
      if (LocalStorageService.getLocalValue(LocalStorage.ISADMIN) === 'true') {
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
