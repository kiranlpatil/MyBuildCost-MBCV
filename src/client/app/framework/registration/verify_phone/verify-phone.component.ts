import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ImagePath, LocalStorage, Messages, NavigationRoutes, ProjectAsset, AppSettings} from "../../../shared/constants";
import {VerifyUser} from "./verify_phone";
import {VerifyPhoneService} from "./verify-phone.service";
import {MessageService} from "../../../shared/services/message.service";
import {Message} from "../../../shared/models/message";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {ValidationService} from "../../../shared/customvalidations/validation.service";
import {Login} from "../../../user/login/login";
import {LoginService} from "../../../user/login/login.service";
import {RegistrationService} from "../../shared/registration.service";

@Component({
  moduleId: module.id,
  selector: 'tpl-verify-phone',
  templateUrl: 'verify-phone.component.html',
  styleUrls: ['verify-phone.component.css'],
})
export class VerifyPhoneComponent {
  model = new VerifyUser();
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  MY_LOGO_PATH: string;
  MY_TAG_LINE: string;
  UNDER_LICENCE: string;
  BODY_BACKGROUND: string;
  showModalStyle: boolean = false;
  private loginModel = new Login();
  private submitStatus: boolean;

  constructor(private _router: Router, private formBuilder: FormBuilder,private loginService: LoginService,
              private verifyPhoneService: VerifyPhoneService, private messageService: MessageService, private registrationService: RegistrationService) {

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
    if(this.model.otp === '') {
      this.submitStatus = true;
      return;
    }
    if(!this.userForm.valid) {
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
    /* var message = new Message();
     message.isError = false;
     message.custom_message = Messages.MSG_SUCCESS_NEWREGISTRATION;
     this.messageService.message(message);
     this.navigateTo();*/
  }

  mobileVerificationSuccess(res: any) {
    //this.showModalStyle = !this.showModalStyle;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_CHANGE_MOBILE_NUMBER;
    this.messageService.message(message);
    setTimeout(() => {
      window.localStorage.clear();
      let host = AppSettings.HTTP_CLIENT + window.location.hostname;
      window.location.href = host;
    }, 2000);

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
    message.custom_message = Messages.MSG_SUCCESS_RESEND_VERIFICATION_CODE;
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
    this.loginModel.email=LocalStorageService.getLocalValue(LocalStorage.EMAIL_ID);
    this.loginModel.password=LocalStorageService.getLocalValue(LocalStorage.PASSWORD);
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
