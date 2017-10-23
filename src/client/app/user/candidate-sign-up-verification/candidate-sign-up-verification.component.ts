import {Component} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ImagePath, LocalStorage, Messages, ProjectAsset, AppSettings} from "../../shared/constants";
import {VerifyCandidate} from "../models/verify-candidate";
import {CandidateSignUpVerificationService} from "./candidate-sign-up-verification.service";
import {MessageService} from "../../shared/services/message.service";
import {Message} from "../../shared/models/message";
import {LocalStorageService} from "../../shared/services/localstorage.service";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {Login} from "../models/login";
import {LoginService} from "../../user/login/login.service";
import {RegistrationService} from "../services/registration.service";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-sign-up-verification',
  templateUrl: 'candidate-sign-up-verification.component.html',
  styleUrls: ['candidate-sign-up-verification.component.css'],
})
export class CandidateSignUpVerificationComponent {
  model = new VerifyCandidate();
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  MY_LOGO_PATH: string;
  MY_TAG_LINE: string;
  UNDER_LICENCE: string;
  BODY_BACKGROUND: string;
  showModalStyle: boolean = false;
  private loginModel = new Login();
  submitStatus: boolean;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private _router: Router,
              private verifyPhoneService: CandidateSignUpVerificationService, private messageService: MessageService,
              private registrationService: RegistrationService) {

    this.userForm = this.formBuilder.group({
      'otp': ['', ValidationService.requireOtpValidator]
    });

    this.MY_LOGO_PATH = ImagePath.MY_WHITE_LOGO;
    this.MY_TAG_LINE = ProjectAsset.TAG_LINE;
    this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  onSubmit() {
    this.model = this.userForm.value;
    if (this.model.otp === '') {
      this.submitStatus = true;
      return;
    }
    if (!this.userForm.valid) {
      return;
    }

    if (LocalStorageService.getLocalValue(LocalStorage.VERIFY_PHONE_VALUE) === 'from_registration') {
      this.verifyPhoneService.verifyPhone(this.model)
        .subscribe(
          res => (this.verifySuccess(res)),
          error => (this.verifyFail(error)));
    } else {
      this.verifyPhoneService.changeMobile(this.model)
        .subscribe(
          res => (this.mobileVerificationSuccess(res)),
          error => (this.verifyFail(error)));
    }
  }

  getMessages() {
    return Messages;
  }

  resendVerificationCode() {
    if (LocalStorageService.getLocalValue(LocalStorage.VERIFY_PHONE_VALUE) === 'from_registration') {
      this.verifyPhoneService.resendVerificationCode()
        .subscribe(
          res => (this.resendOtpSuccess(res)),
          error => (this.resendOtpFail(error)));
    } else {
      this.verifyPhoneService.resendChangeMobileVerificationCode()
        .subscribe(res => (this.resendChangeMobileOtpSuccess(res)),
          error => (this.resendOtpFail(error)));
    }
  }

  verifySuccess(res: any) {
    this.showModalStyle = !this.showModalStyle;
  }

  mobileVerificationSuccess(res: any) {
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, LocalStorage.VERIFIED_MOBILE_NUMBER);
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_CHANGE_MOBILE_NUMBER;
    this.messageService.message(message);
    this._router.navigate(['/profile/'+LocalStorageService.getLocalValue(LocalStorage.ROLE_NAME)]);
    /*setTimeout(() => {
      window.localStorage.clear();
      let host = AppSettings.HTTP_CLIENT + window.location.hostname;
      window.location.href = host;
    }, 2000);
*/
  }

  verifyFail(error: any) {

    if (error.err_code === 404 || error.err_code === 0) {
      var message = new Message();
      message.error_msg = error.message;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;
    }

  }

  resendChangeMobileOtpSuccess(res: any) {

    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_RESEND_VERIFICATION_CODE_RESEND_OTP;
    this.messageService.message(message);
  }

  resendOtpSuccess(res: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_RESEND_VERIFICATION_CODE;
    this.messageService.message(message);
  }

  resendOtpFail(error: any) {
    if (error.err_code === 404 || error.err_code === 0) {
      var message = new Message();
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      var message = new Message();
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    }
  }

  navigateTo() {
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

}
