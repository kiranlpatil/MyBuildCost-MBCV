import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangePasswordService } from './change-password.service';
import { ChangePassword } from './changepassword';
import { CommonService, ImagePath, Message, MessageService, NavigationRoutes } from '../../shared/index';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from '../../shared/loader/loader.service';
import { ValidationService } from '../../shared/customvalidations/validation.service';
import { Messages, AppSettings } from '../../shared/constants';


@Component({
  moduleId: module.id,
  selector: 'tpl-change-password',
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
  confirmPassword: string= Messages.MSG_CONFIRM_PASSWORD;
  changePasswordSuccessMessage: string= Messages.MSG_CHANGE_PASSWORD_SUCCESS;

  constructor(private commonService: CommonService,
              private _router: Router,
              private passwordService: ChangePasswordService,
              private messageService: MessageService,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {

    this.userForm = this.formBuilder.group({
      'new_password': ['', ValidationService.requireNewPasswordValidator],
      'confirm_password': ['', [ValidationService.requireConfirmPasswordValidator]],
      'current_password': ['', [ValidationService.requireCurrentPasswordValidator]]
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
}
