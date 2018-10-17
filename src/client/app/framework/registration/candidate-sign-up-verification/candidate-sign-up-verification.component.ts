/*
import { Component } from '@angular/core';
import { SessionStorage, Messages } from '../../../shared/constants';
import { Login } from '../../../user/models/login';
import { SessionStorageService } from '../../../shared/services/session.service';
import { AnalyticService } from '../../../shared/services/analytic.service';
import { Router } from '@angular/router';
declare var fbq: any;

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-sign-up-verification',
  templateUrl: 'candidate-sign-up-verification.component.html',
  styleUrls: ['candidate-sign-up-verification.component.css'],
})
export class CandidateSignUpVerificationComponent {
  signUpVerificationMessage:string;
  signUpVerificationHeading:string;
  actionName:string;
  userID:string;
  mobileNumber:any;
  private loginModel:Login;
  private showModalStyle: boolean = false;


  constructor(private _router: Router, private analyticService: AnalyticService) {
    this.signUpVerificationMessage = this.getMessages().MSG_MOBILE_VERIFICATION_MESSAGE;
    this.signUpVerificationHeading = this.getMessages().MSG_MOBILE_VERIFICATION_TITLE;
    this.actionName = this.getMessages().FROM_REGISTRATION;
    this.loginModel = new Login();
    this.userID=SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    this.mobileNumber=SessionStorageService.getSessionValue(SessionStorage.MOBILE_NUMBER);
    fbq('track', 'PageView');
    this.analyticService.googleAnalyse(this._router);
  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  toggleModal() {
    this.showModalStyle = !this.showModalStyle;
  }
  getMessages() {
    return Messages;
  }

}
*/
