import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../../shared/services/message.service';
import { SessionStorageService } from '../../../../shared/services/session.service';
import { SessionStorage, NavigationRoutes } from '../../../../shared/index';
import { ResetPasswordService } from './reset-password.service';
import { ImagePath, Messages, ProjectAsset, Label, Button, Headings } from '../../../../shared/constants';
import { Message } from '../../../../shared/models/message';
import { ResetPassword } from '../../../../user/models/reset-password';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';


@Component({
  moduleId: module.id,
  selector: 'cn-reset-password',
  templateUrl: 'reset-password.component.html',
  styleUrls: ['reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  error_msg: string;
  isShowErrorMessage: boolean = true;
  token: string;
  id: string;
  model = new ResetPassword();
  userForm: FormGroup;
  isPasswordConfirm: boolean;
  MY_LOGO_PATH: string;
  APP_NAME: string;
  MY_TAG_LINE: string;
  UNDER_LICENCE: string;
  BODY_BACKGROUND: string;
  submitStatus: boolean;

  constructor(private activatedRoute: ActivatedRoute, private _router: Router, private messageService: MessageService,
              private resetPasswordService: ResetPasswordService, private formBuilder: FormBuilder) {

    this.userForm = this.formBuilder.group({
      'new_password': ['', [ValidationService.requirePasswordValidator, ValidationService.passwordValidator]],
      'confirm_password': ['', [ValidationService.requirePasswordValidator]]
    });

    this.MY_LOGO_PATH = ImagePath.MY_WHITE_LOGO;
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.MY_TAG_LINE = ProjectAsset.TAG_LINE;
    this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }


  ngOnInit() {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let access_token = params['access_token'];
      let id = params['_id'];
      SessionStorageService.setSessionValue(SessionStorage.ACCESS_TOKEN, access_token);
      SessionStorageService.setSessionValue(SessionStorage.USER_ID, id);
    });

  }

  onSubmit() {
    if (!this.userForm.valid) {
      this.submitStatus = true;
      return;
    }
    this.model = this.userForm.value;
    if (!this.makePasswordConfirm()) {
      this.resetPasswordService.newPassword(this.model)
        .subscribe(
          res => (this.onNewPasswordSuccess(res)),
          error => (this.onNewPasswordFailure(error)));
    }
  }

  onNewPasswordSuccess(res: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_RESET_PASSWORD;
    this.messageService.message(message);
    this._router.navigate([NavigationRoutes.APP_LOGIN]);

  }

  onNewPasswordFailure(error: any) {
    if (error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      var message = new Message();
      message.error_msg = error.err_msg;
      message.error_code =  error.err_code;
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

  makePasswordConfirm(): boolean {
    if (this.model.confirm_password !== this.model.new_password) {
      this.isPasswordConfirm = true;
      return true;
    } else {
      this.isPasswordConfirm = false;
      return false;
    }
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
  getMessages() {
    return Messages;
  }

}

