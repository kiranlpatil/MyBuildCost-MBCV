import {Component, Input} from "@angular/core";
import {Router} from "@angular/router";
import {ImagePath, LoaderService, NavigationRoutes} from "../shared/index";

@Component({
  moduleId: module.id,
  selector: 'main-header',
  templateUrl: 'main-header.component.html',
  styleUrls: ['main-header.component.css'],
})
export class MainHeaderComponent {
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
  onApplicantSignUp() {
    this._router.navigate(['/applicant-signup']);
  }
  onRecruiterSignUp() {
    this._router.navigate(['/recruiter-signup']);
  }

    onHomePage() {
      window.localStorage.clear();
      let host = 'http://' + window.location.hostname + ':80';
      this._router.navigate([host]);
    }
}

