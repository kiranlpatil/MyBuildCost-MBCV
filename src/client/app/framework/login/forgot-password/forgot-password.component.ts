import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { ForgotPassword } from '../../../user/models/forgot-password';
import { ForgotPasswordService } from './forgot-password.service';
import { Message, Messages, MessageService, NavigationRoutes } from '../../../shared/index';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../shared/customvalidations/validation.service';
import { ImagePath, ProjectAsset } from '../../../shared/constants';


@Component({
  moduleId: module.id,
  selector: 'cn-forgot-password',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['forgot-password.component.css'],
})

export class ForgotPasswordComponent implements OnInit{
  model = new ForgotPassword();
  userForm: FormGroup;
  error_msg: string;
  MY_LOGO_PATH: string;
  MY_TAG_LINE: string;
  UNDER_LICENCE: string;
  emailForForgetPassword: string;
  EMAIL_ICON: string;
  BODY_BACKGROUND: string;
  forgotPasswordButtonLabel: string;
  forgotPasswordMessage: string = Messages.MSG_FORGOT_PASSWORD;
  submitStatus: boolean;
  isShowLoader: boolean = false;


  constructor(private _router: Router,
              private forgotPasswordService: ForgotPasswordService,
              private messageService: MessageService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute ) {
    this.userForm = this.formBuilder.group({
      'email': ['', [ValidationService.requireEmailValidator, ValidationService.emailValidator]]
    });

    this.MY_LOGO_PATH = ImagePath.MY_WHITE_LOGO;
    this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
    this.MY_TAG_LINE = ProjectAsset.TAG_LINE;
    this.EMAIL_ICON = ImagePath.EMAIL_ICON;
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.forgotPasswordButtonLabel = 'Request Reset Link';
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.emailForForgetPassword = params['email'];
    });
  }

  onSubmit() {
    this.model = this.userForm.value;
    this.error_msg='';
    if (this.model.email == '') {
      this.submitStatus = true;
      return;
    }
    if (!this.userForm.valid) {
      this.submitStatus = true;
      return;
    }
    this.isShowLoader = true;
    this.forgotPasswordService.forgotPassword(this.model)
      .subscribe(
        body => {
          this.onForgotPasswordSuccess(body);
          this.isShowLoader = false;
        },
        error => {
          this.isShowLoader = false;
          this.onForgotPasswordFailure(error);
        }
      );
  }

  onForgotPasswordSuccess(body: ForgotPassword) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_FORGOT_PASSWORD;
    this.messageService.message(message);
    this.forgotPasswordButtonLabel = 'Resend Email';
  }

  onForgotPasswordFailure(error: any) {
    if (error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      var message = new Message();
      message.error_msg = error.err_msg;
      message.error_code =  error.err_code;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.error_msg = error.err_msg;
    }
  }

  goBack() {
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }

}


