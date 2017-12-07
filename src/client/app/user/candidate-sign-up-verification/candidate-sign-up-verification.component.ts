import {Component} from "@angular/core";
import {LocalStorage, Messages} from "../../shared/constants";
import {RegistrationService} from "../services/registration.service";
import {Login} from "../models/login";
import {LocalStorageService} from "../../shared/services/localstorage.service";
import {LoginService} from "../login/login.service";
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
    this.userID=LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    this.mobileNumber=LocalStorageService.getLocalValue(LocalStorage.MOBILE_NUMBER);
    fbq('track', 'PageView');
    this.analyticService.googleAnalyse(this._router);
  }
  navigateToDashboard() {
    this.loginModel.email = LocalStorageService.getLocalValue(LocalStorage.EMAIL_ID);
    this.loginModel.password = LocalStorageService.getLocalValue(LocalStorage.PASSWORD);
    this.loginService.userLogin(this.loginModel)
      .subscribe(
        res => (this.registrationService.onSuccess(res)),
        error => (this.registrationService.loginFail(error)));
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
