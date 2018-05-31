import { Component } from '@angular/core';
import { UserChangePasswordService } from './user-change-password.service';
import { CommonService, ImagePath, Message, MessageService } from '../../../shared/index';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from '../../../shared/loader/loaders.service';
import { ValidationService } from '../../../shared/customvalidations/validation.service';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes,LocalStorage } from '../../../shared/constants';
import { ErrorService } from '../../../shared/services/error.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../../../user/models/user';
import { ChangePassword } from '../../../user/models/change-password';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
@Component({
  moduleId: module.id,
  selector: 'dashboard-change-password',
  templateUrl: 'user-change-password.component.html',
  styleUrls: ['user-change-password.component.css'],
})

export class UserChangePasswordComponent {
  isPasswordConfirm: boolean;
  model = new ChangePassword();
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  showModalStyle: boolean = false;
  PASSWORD_ICON: string;
  NEW_PASSWORD_ICON: string;
  CONFIRM_PASSWORD_ICON: string;
  userModel : UserProfile = new UserProfile();
  role: string;
  isSocialLogin:boolean;
  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private errorService: ErrorService,
              private commonService: CommonService, private passwordService: UserChangePasswordService,
              private messageService: MessageService, private formBuilder: FormBuilder,
              private loaderService: LoaderService) {

    this.userForm = this.formBuilder.group({
      'new_password': ['', [ValidationService.passwordValidator]],
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
          body => this.onChangePasswordSuccess(body),
          error => this.onChangePasswordFailure(error));
    }
    document.body.scrollTop = 0;
  }

  onChangePasswordSuccess(body: ChangePassword) {
    this.loaderService.stop();
    this.showHideModal();
    this.error_msg = '';
  }

  onChangePasswordFailure(error: any) {
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
  moveToDashboard() {
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }
  logOut() {
    if(LocalStorageService.getLocalValue(LocalStorage.IS_LOGGED_IN)===null) {
      window.sessionStorage.clear();
      window.localStorage.clear();
    }
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
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

  getHeadings() {
    return Headings;
  }

  OnCandidateDataSuccess(candidateData: any) {
    this.model = candidateData.data[0];
  }

  goToDashboard()  {
  this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
}

}
