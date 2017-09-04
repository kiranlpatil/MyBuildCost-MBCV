import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ChangeEmailService} from "./change-email.service";
import {ChangeEmail} from "./changeemail";
import {LocalStorageService} from "../../../shared/localstorage.service";
import {LocalStorage, AppSettings} from "../../../shared/constants";
import {CommonService, ImagePath, Message, Messages, MessageService} from "../../../shared/index";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../../shared/customvalidations/validation.service";


@Component({
  moduleId: module.id,
  selector: 'tpl-change-email',
  templateUrl: 'change-email.component.html',
  styleUrls: ['change-email.component.css'],
})

export class ChangeEmailComponent implements OnInit {
  isEmailConfirm: boolean;
  model = new ChangeEmail();
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  EMAIL_ICON: string;
  NEW_EMAIL_ICON: string;
  CONFIRM_EMAIL_ICON: string;
  emailNotMatctMessage:string= Messages.MSG_EMAIL_NOT_MATCH;

  constructor(private commonService: CommonService, private _router: Router,
              private emailService: ChangeEmailService, private messageService: MessageService, private formBuilder: FormBuilder) {

    this.userForm = this.formBuilder.group({
      'new_email': ['', [Validators.required, ValidationService.emailValidator]],
      'confirm_email': ['', [Validators.required, ValidationService.emailValidator]],
      'current_email': ['', [Validators.required, ValidationService.emailValidator]]
    });

    this.EMAIL_ICON = ImagePath.EMAIL_ICON_GREY;
    this.NEW_EMAIL_ICON = ImagePath.NEW_EMAIL_ICON_GREY;
    this.CONFIRM_EMAIL_ICON = ImagePath.CONFIRM_EMAIL_ICON_GREY;
  }

  makeEmailConfirm(): boolean {
    if (this.model.confirm_email !== this.model.new_email) {
      this.isEmailConfirm = true;
      return true;
    } else {
      this.isEmailConfirm = false;
      return false;
    }
  }

  ngOnInit() {
    this.model.current_email = LocalStorageService.getLocalValue(LocalStorage.EMAIL_ID);
  }

  onSubmit() {
    this.model = this.userForm.value;
    this.model.current_email = LocalStorageService.getLocalValue(LocalStorage.EMAIL_ID);
    LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_settings');
    if (!this.makeEmailConfirm()) {
      this.emailService.changeEmail(this.model)
        .subscribe(
          body => this.changeEmailSuccess(body),
          error => this.changeEmailFail(error));
    }
    document.body.scrollTop = 0;
  }

  changeEmailSuccess(body: ChangeEmail) {
    window.localStorage.clear();
    LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_settings');
    this.userForm.reset();
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_CHANGE_EMAIL;
    this.messageService.message(message);
    this.logOut();
  }

  changeEmailFail(error: any) {
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

  goBack() {
    this.commonService.goBack();
  }

  logOut() {
    window.localStorage.clear();
    LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_settings');
    let host = AppSettings.HTTP_CLIENT + window.location.hostname;
    window.location.href = host;
  }
}
