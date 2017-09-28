import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ForgotPassword} from "../models/forgotpassword";
import {ForgotPasswordService} from "./forgot-password.service";
import {Message, Messages, MessageService, NavigationRoutes} from "../../shared/index";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {ImagePath, ProjectAsset} from "../../shared/constants";


@Component({
  moduleId: module.id,
  selector: 'cn-forgot-password',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['forgot-password.component.css'],
})

export class ForgotPasswordComponent {
  model = new ForgotPassword();
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  MY_LOGO_PATH: string;
  MY_TAG_LINE: string;
  UNDER_LICENCE: string;
  EMAIL_ICON: string;
  BODY_BACKGROUND: string;
  forgotPasswordButtonLabel: string;
  forgotPasswordMessage: string = Messages.MSG_FORGOT_PASSWORD;
  submitStatus: boolean;
  isShowLoader: boolean = false;


  constructor(private _router: Router,
              private forgotPasswordService: ForgotPasswordService, private messageService: MessageService,
              private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      'email': ['', [ValidationService.requireEmailValidator, ValidationService.emailValidator]]
    });

    this.MY_LOGO_PATH = ImagePath.MY_WHITE_LOGO;
    this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
    this.MY_TAG_LINE = ProjectAsset.TAG_LINE;
    this.EMAIL_ICON = ImagePath.EMAIL_ICON;
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.forgotPasswordButtonLabel = 'Send Email';
  }

  onSubmit() {
    this.model = this.userForm.value;
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
          this.forgotPasswordSuccess(body);
          this.isShowLoader = false;
        },
        error => {
          this.isShowLoader = false;
          this.forgotPasswordFail(error)
        }
      );
  }

  forgotPasswordSuccess(body: ForgotPassword) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_FORGOT_PASSWORD;
    this.messageService.message(message);
    this.forgotPasswordButtonLabel = 'Resend Email';
  }

  forgotPasswordFail(error: any) {
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

  navigateTo(navigateTo: string) {
    if (navigateTo !== undefined) {
      this._router.navigate([navigateTo]);
    }
  }

  goBack() {
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }

}


