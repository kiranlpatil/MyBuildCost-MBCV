/*
import { Component, Output, Input , EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Messages, SessionStorage } from '../../shared/constants';
import { VerifyOtp  } from '../models/verify-otp';
import { MessageService } from '../../shared/services/message.service';
import { Message } from '../../shared/models/message';
import { ValidationService } from '../../shared/customvalidations/validation.service';
import { LoginService } from '../../framework/login/login.service';
import { RegistrationService } from '../services/registration.service';
import { OtpVerificationService } from './otp-verification.service';
import { SessionStorageService } from '../../shared/services/session.service';
import { Login } from '../models/login';

@Component({
  moduleId: module.id,
  selector: 'cn-otp-verification',
  templateUrl: 'otp-verification.component.html',
  styleUrls: ['otp-verification.component.css'],
})
export class OtpVerificationComponent {
  @Input() verificationMessage: string;
  @Input() verificationHeading: string;
  @Input() actionName: string;
  @Input() changeMobileNumberInfo:any;
  @Input() userID:any;
  @Input() mobileNumber:any;
  @Output() onMobileNumberChangeSuccess: EventEmitter<boolean> = new EventEmitter();
  @Output() onMobileVerificationSuccess: EventEmitter<boolean> = new EventEmitter();
  verifyOtpModel:VerifyOtp;
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  submitStatus: boolean;
  private loginModel:Login;
  constructor(private formBuilder: FormBuilder, private verifyPhoneService: OtpVerificationService,
              private messageService: MessageService, private loginService: LoginService,
              private registrationService: RegistrationService) {
    this.loginModel = new Login();

    this.userForm = this.formBuilder.group({
      'otp': ['', ValidationService.requireOtpValidator]
    });
    this.verifyOtpModel = new VerifyOtp();
  }
  onSubmit() {
    this.verifyOtpModel = this.userForm.value;
    if (this.verifyOtpModel.otp === '') {
      this.submitStatus = true;
      return;
    }
    if (!this.userForm.valid) {
      return;
    }

    if (this.actionName===this.getMessages().FROM_REGISTRATION) {
      this.verifyPhoneService.verifyPhone(this.verifyOtpModel,this.userID)
        .subscribe(
          res => (this.onVerifyPhoneSuccess(res)),
          error => (this.onVerifyPhoneFailure(error)));
    } else {
      this.verifyPhoneService.changeMobile(this.verifyOtpModel,this.changeMobileNumberInfo.id)
        .subscribe(
          res => (this.mobileVerificationSuccess(res)),
          error => (this.onVerifyPhoneFailure(error)));
    }
  }
  resendVerificationCode() {
    if (this.actionName===this.getMessages().FROM_REGISTRATION) {
      this.verifyPhoneService.resendVerificationCode(this.userID,this.mobileNumber)
        .subscribe(
          res => (this.resendOtpSuccess(Messages.MSG_SUCCESS_RESEND_VERIFICATION_CODE)),
          error => (this.resendOtpFailure(error)));
    } else {
      this.verifyPhoneService.resendChangeMobileVerificationCode(this.changeMobileNumberInfo)
        .subscribe(res => (this.resendOtpSuccess(Messages.MSG_SUCCESS_RESEND_VERIFICATION_CODE_RESEND_OTP)),
          error => (this.resendOtpFailure(error)));
    }
  }

  onVerifyPhoneSuccess(res: any) {
    this.onMobileVerificationSuccess.emit();
    this.navigateToDashboard();
  }

  navigateToDashboard() {
    this.loginModel.email = SessionStorageService.getSessionValue(SessionStorage.EMAIL_ID);
    this.loginModel.password = SessionStorageService.getSessionValue(SessionStorage.PASSWORD);
    this.loginService.userLogin(this.loginModel)
      .subscribe(
        (res:any) => (this.registrationService.onGetUserDataSuccess(res)),
        (error:any) => (this.registrationService.onLoginFailure(error)));
  }
  mobileVerificationSuccess(res: any) {
    this.showInformationMessage(Messages.MSG_SUCCESS_CHANGE_MOBILE_NUMBER);
    this.onMobileNumberChangeSuccess.emit();
  }
  onVerifyPhoneFailure(error: any) {
    if (error.err_code === 404 ||error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      this.showErrorMessage(error);
    } else {
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;
    }

  }
  resendOtpSuccess(successMessage: any) {
    this.showInformationMessage(successMessage);
  }
  resendOtpFailure(error: any) {
    if (error.err_code === 404 ||error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      this.showErrorMessage(error);
    } else {
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;
      this.showErrorMessage(error);
    }
  }
  getMessages() {
    return Messages;
  }

  showInformationMessage(customMessage:any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = customMessage;
    this.messageService.message(message);
  }

  showErrorMessage(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.error_code =  error.err_code;
    message.isError = true;
    this.messageService.message(message);
  }

}
*/
