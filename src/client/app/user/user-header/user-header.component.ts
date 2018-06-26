import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ImagePath, LoaderService, NavigationRoutes } from '../../shared/index';
import { AppSettings } from '../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'cn-user-header',
  templateUrl: 'user-header.component.html',
  styleUrls: ['user-header.component.css'],
})
export class UserHeaderComponent {
  BODY_BACKGROUND: string;
  @Input() MainHeaderMenuHideShow:string;
  constructor(private loaderService: LoaderService, private _router: Router) {
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  onLogin() {
      this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }

  onSignUp() {
    this._router.navigate([NavigationRoutes.APP_REGISTRATION]);
  }
  /*onApplicantSignUp() {
    this._router.navigate(['/applicant-signup']);
  }*/

    onHomePage() {
      window.sessionStorage.clear();
      window.localStorage.clear();
      let host = AppSettings.HTTP_CLIENT + AppSettings.HOST_NAME;
      window.location.href = host;
    }

  getImagePath() {
    return ImagePath;
  }
}

