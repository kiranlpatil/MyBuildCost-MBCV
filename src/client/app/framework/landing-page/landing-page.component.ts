import { Component } from '@angular/core';
import { ImagePath, NavigationRoutes } from '../../shared/index';
import { Messages } from '../../shared/constants';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'landing-page',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['landing-page.component.css'],
})
export class LandingPageComponent {
 // BODY_BACKGROUND: string;
 // landingPageText: string= Messages.MSG_LANDING_PAGE;
 // isChrome: boolean;
  constructor(private _router: Router) {
   // this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }
  goToSignUp() {
    this._router.navigate( [NavigationRoutes. APP_REGISTRATION]);
  }
  goToSignIn() {
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }
}
