import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ImagePath, LocalStorage, Messages, NavigationRoutes, ProjectAsset} from "../../shared/constants";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {VerifyUser} from "./verify_user";
import {VerifyUserService} from "./verify-user.service";
import {LocalStorageService} from "../../shared/localstorage.service";
import {Message} from "../../shared/message";
import {MessageService} from "../../shared/message.service";

@Component({
  moduleId: module.id,
  selector: 'tpl-activate-user',
  templateUrl: 'verify-user.component.html',
  styleUrls: ['verify-user.component.css'],
})
export class VerifyUserComponent implements OnInit {
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

  constructor(private _router: Router, private formBuilder: FormBuilder,
              private verifyUserService: VerifyUserService, private messageService: MessageService) {

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
    if(this.isCandidate && this.userForm.value.mobile_number == null){
      return;
    }else if(!this.isCandidate && this.userForm.value.email == null){
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
      this.verifyUserService.verifyUserByMail(this.model)
        .subscribe(
          res => (this.verifySuccess(res)),
          error => (this.verifyFail(error)));
    }
  }

  verifySuccess(res: any) {
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
