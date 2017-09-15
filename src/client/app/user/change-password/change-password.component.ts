import {Component} from "@angular/core";
import {ChangePasswordService} from "./change-password.service";
import {ChangePassword} from "../models/changepassword";
import {CommonService, ImagePath, Message, MessageService} from "../../shared/index";
import {FormBuilder, FormGroup} from "@angular/forms";
import {LoaderService} from "../../shared/loader/loaders.service";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {AppSettings, Messages, Label, Button} from "../../shared/constants";


@Component({
  moduleId: module.id,
  selector: 'cn-change-password',
  templateUrl: 'change-password.component.html',
  styleUrls: ['change-password.component.css'],
})

export class ChangePasswordComponent {
  isPasswordConfirm: boolean;
  model = new ChangePassword();
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  showModalStyle: boolean = false;
  PASSWORD_ICON: string;
  NEW_PASSWORD_ICON: string;
  CONFIRM_PASSWORD_ICON: string;

  constructor(private commonService: CommonService,
              private passwordService: ChangePasswordService,
              private messageService: MessageService,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {

    this.userForm = this.formBuilder.group({
      'new_password': ['', [ValidationService.requireNewPasswordValidator, ValidationService.passwordValidator]],
      'confirm_password': ['', [ValidationService.requireConfirmPasswordValidator, ValidationService.passwordValidator]],
      'current_password': ['', [ValidationService.requireCurrentPasswordValidator, ValidationService.passwordValidator]]
    });

    this.PASSWORD_ICON = ImagePath.PASSWORD_ICON_GREY;
    this.NEW_PASSWORD_ICON = ImagePath.NEW_PASSWORD_ICON_GREY;
    this.CONFIRM_PASSWORD_ICON = ImagePath.CONFIRM_PASSWORD_ICON_GREY;
  }

  makePasswordConfirm(): boolean {
    if (this.model.confirm_password !== this.model.new_password) {
      this.isPasswordConfirm = true;
      return true;
    } else {
      this.isPasswordConfirm = false;
      return false;
    }
  }

  onSubmit() {
    this.model = this.userForm.value;
    if (!this.userForm.valid) {
      return;
    }
    if (!this.makePasswordConfirm()) {
      this.loaderService.start();
      this.passwordService.changePassword(this.model)
        .subscribe(
          body => this.changePasswordSuccess(body),
          error => this.changePasswordFail(error));
    }
    document.body.scrollTop = 0;
  }

  changePasswordSuccess(body: ChangePassword) {
    this.loaderService.stop();
    this.showHideModal();
    this.error_msg = '';
  }

  changePasswordFail(error: any) {
    this.loaderService.stop();
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

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  logOut() {
    window.localStorage.clear();
    let host = AppSettings.HTTP_CLIENT + window.location.hostname;
    window.location.href = host;
  }

  getStyle() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  getMessages() {
    return Messages;
  }

  getLabels() {
    return Label;
  }

  getButtons() {
    return Button;
  }
}
