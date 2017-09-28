import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ImagePath, LocalStorage, Messages, NavigationRoutes, ProjectAsset} from "../../shared/constants";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {VerifyUser} from "../models/verify-user";
import {UserVerificationService} from "./user-verification.service";
import {LocalStorageService} from "../../shared/services/localstorage.service";
import {Message} from "../../shared/models/message";
import {MessageService} from "../../shared/services/message.service";

@Component({
  moduleId: module.id,
  selector: 'cn-user-verification',
  templateUrl: 'user-verification.component.html',
  styleUrls: ['user-verification.component.css'],
})
export class UserVerificationComponent implements OnInit {
  model = new VerifyUser();
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  isCandidate: boolean = false;
  chkMobile: boolean = false;
  isMailSent: boolean = false;
  chkEmail: boolean = true;
  MY_LOGO_PATH: string;
  MY_TAG_LINE: string;
  UNDER_LICENCE: string;
  BODY_BACKGROUND: string;
  submitMobileStatus: boolean;
  submitEmailStatus: boolean;
  verifyUserMessage_1: string= Messages.MSG_VERIFY_USER_1;
  verifyUserMessage_2: string= Messages.MSG_VERIFY_USER_2;
  verifyUserMessage_3: string= Messages.MSG_VERIFY_USER_3;
  verifyUserMessage_4: string= Messages.MSG_VERIFY_USER_4;
  isShowLoader: boolean = false;


  constructor(private _router: Router, private formBuilder: FormBuilder,
              private verifyUserService: UserVerificationService, private messageService: MessageService) {

    this.userForm = this.formBuilder.group({
      'mobile_number': ['', [ValidationService.requireMobileNumberValidator, ValidationService.mobileNumberValidator]],
      'email': ['', [ValidationService.requireEmailValidator, ValidationService.emailValidator]]
    });

    this.MY_LOGO_PATH = ImagePath.MY_WHITE_LOGO;
    this.MY_TAG_LINE = ProjectAsset.TAG_LINE;
    this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  ngOnInit() {
    this.model.mobile_number = LocalStorageService.getLocalValue(LocalStorage.MOBILE_NUMBER);
    this.model.email = LocalStorageService.getLocalValue(LocalStorage.EMAIL_ID);
    let val = LocalStorageService.getLocalValue(LocalStorage.FROM_CANDIDATE_REGISTRATION);
    if (val === 'true') {
      this.isCandidate = true;
      this.chkMobile = false;
      this.chkEmail = true;
    } else {
      this.isCandidate = false;
      this.chkMobile = true;
      this.chkEmail = false;
    }
  }

  navigateTo() {
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }

  onSubmit() {
    if(this.isCandidate && this.userForm.value.mobile_number == 'null'){
      this.submitMobileStatus = true;
      return;
    }else if(!this.isCandidate && this.userForm.value.email == 'null' && !this.userForm.get('email').valid){
      this.submitEmailStatus = true;
      return;
    }
    if(this.isCandidate && this.userForm.value.mobile_number != 'null' && !this.userForm.get('mobile_number').valid){
      this.submitMobileStatus = true;
      return;
    }else if(!this.isCandidate && this.userForm.value.email != 'null' && !this.userForm.get('email').valid){
      this.submitEmailStatus = true;
      return;
    }
    if (!this.chkMobile) {
      this.model = this.userForm.value;
      LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, this.model.mobile_number);
      this.model.mobile_number = LocalStorageService.getLocalValue(LocalStorage.MOBILE_NUMBER);
      this.verifyUserService.verifyUserByMobile(this.model)
        .subscribe(
          res => (this.verifySuccess(res)),
          error => (this.verifyFail(error)));
    } else {
      this.model.email = LocalStorageService.getLocalValue(LocalStorage.EMAIL_ID);
      this.isShowLoader = true;
      this.verifyUserService.verifyUserByMail(this.model)
        .subscribe(
          res => {
            this.verifySuccess(res);
            this.isShowLoader = false;
          },
          error => (this.verifyFail(error))
        );
    }
  }

  verifySuccess(res: any) {
    LocalStorageService.setLocalValue(LocalStorage.AFTER_RECRUITER_REGISTRATION_FORM, '');
    if (!this.chkMobile) {
      LocalStorageService.setLocalValue(LocalStorage.VERIFY_PHONE_VALUE, 'from_registration');
      this._router.navigate([NavigationRoutes.VERIFY_PHONE]);

    } else {
      this.isMailSent = true;
      LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_registration');
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_MAIL_VERIFICATION;
      this.messageService.message(message);
    }
  }

  verifyFail(error: any) {
    if (error.err_code === 404 || error.err_code === 0) {
      var message = new Message();
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;

    }
  }

}
