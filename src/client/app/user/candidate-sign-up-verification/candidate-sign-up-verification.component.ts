import {Component} from "@angular/core";
import {SessionStorage, Messages} from "../../shared/constants";
import {RegistrationService} from "../services/registration.service";
import {Login} from "../models/login";
import {SessionStorageService} from "../../shared/services/session.service";
import {LoginService} from "../../framework/login/login.service";
import {AnalyticService} from "../../shared/services/analytic.service";
import {Router} from "@angular/router";
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
  private loginModel:Login;
  private showModalStyle: boolean = false;
  userID:string;
  mobileNumber:any;

  constructor(private _router: Router, private analyticService: AnalyticService, private registrationService: RegistrationService, private loginService: LoginService,) {
    this.signUpVerificationMessage = this.getMessages().MSG_MOBILE_VERIFICATION_MESSAGE;
    this.signUpVerificationHeading = this.getMessages().MSG_MOBILE_VERIFICATION_TITLE;
    this.actionName = this.getMessages().FROM_REGISTRATION;
    this.loginModel = new Login();
    this.userID=SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    this.mobileNumber=SessionStorageService.getSessionValue(SessionStorage.MOBILE_NUMBER);
    fbq('track', 'PageView');
    this.analyticService.googleAnalyse(this._router);
  }
  navigateToDashboard() {
    this.loginModel.email = SessionStorageService.getSessionValue(SessionStorage.EMAIL_ID);
    this.loginModel.password = SessionStorageService.getSessionValue(SessionStorage.PASSWORD);
    this.loginService.userLogin(this.loginModel)
      .subscribe(
        (res:any) => (this.registrationService.onSuccess(res)),
        (error:any) => (this.registrationService.loginFail(error)));
  }
  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }
  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }
  getMessages() {
    return Messages;
  }

}
