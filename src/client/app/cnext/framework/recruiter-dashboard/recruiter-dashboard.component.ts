
import {  Component,OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';
import {LocalStorage, ImagePath, AppSettings} from '../../../framework/shared/constants';
import { NavigationRoutes } from '../../../framework/shared/constants';
@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard',
  templateUrl: 'recruiter-dashboard.component.html',
  styleUrls: ['recruiter-dashboard.component.css']
})

export class RecruiterDashboardComponent implements  OnInit {
  company_name:string;
  uploaded_image_path:string;

    constructor(private _router:Router) {
  }
  ngOnInit() {
    this.company_name = LocalStorageService.getLocalValue(LocalStorage.COMPANY_NAME);
    this.uploaded_image_path = LocalStorageService.getLocalValue(LocalStorage.PROFILE_PICTURE); //TODO:Get it from get user call.

    if ( this.uploaded_image_path === "undefined" || this.uploaded_image_path === null ) {
      this.uploaded_image_path = ImagePath.PROFILE_IMG_ICON;
    } else {
      this.uploaded_image_path = this.uploaded_image_path.substring(4,this.uploaded_image_path.length-1).replace('"','');
      this.uploaded_image_path = AppSettings.IP + this.uploaded_image_path;
    }
  }

  logOut() {
    LocalStorageService.removeLocalValue(LocalStorage.IS_CANDIDATE);
    LocalStorageService.removeLocalValue(LocalStorage.ACCESS_TOKEN);
    LocalStorageService.removeLocalValue(LocalStorage.IS_THEME_SELECTED);
    LocalStorageService.removeLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
    LocalStorageService.removeLocalValue(LocalStorage.USER_ID);
    LocalStorageService.setLocalValue(LocalStorage.IS_LOGED_IN, 0);
    this._router.navigate([NavigationRoutes.APP_START]);
  }



}
