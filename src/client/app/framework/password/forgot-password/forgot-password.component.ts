import {  Component } from '@angular/core';
import {  Router } from '@angular/router';
import { ForgotPassword } from './forgotpassword';
import { ForgotPasswordService } from './forgot-password.service';
import { Message, Messages, MessageService, CommonService} from '../../shared/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../shared/customvalidations/validation.service';
import { ImagePath, ProjectAsset } from '../../shared/constants';
import {LoaderService} from "../../shared/loader/loader.service";



@Component({
  moduleId: module.id,
  selector: 'tpl-forgotpassword',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  model = new ForgotPassword();
  userForm:FormGroup;
  error_msg:string;
  isShowErrorMessage:boolean = true;
  MY_LOGO_PATH:string;
  MY_TAG_LINE:string;
  UNDER_LICENCE:string;
  EMAIL_ICON:string;
  BODY_BACKGROUND:string;

  constructor(private commanService:CommonService, private _router:Router,
              private forgotPasswordService:ForgotPasswordService, private messageService:MessageService,
              private formBuilder:FormBuilder,private loaderService:LoaderService) {
    this.userForm = this.formBuilder.group({
      'email': ['', [Validators.required, ValidationService.emailValidator]]
    });

    this.MY_LOGO_PATH = ImagePath.MY_WHITE_LOGO;
    this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
    this.MY_TAG_LINE = ProjectAsset.TAG_LINE;
    this.EMAIL_ICON = ImagePath.EMAIL_ICON;
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  onSubmit() {
    //this.loaderService.start();
    this.model = this.userForm.value;
    this.forgotPasswordService.forgotPassword(this.model)
        .subscribe(
            body => this.forgotPasswordSuccess(body),
            error => this.forgotPasswordFail(error));
  }

  forgotPasswordSuccess(body:ForgotPassword) {
    var message = new Message();
    //this.loaderService.stop();
    this.userForm.reset();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_FORGOT_PASSWORD;
    this.messageService.message(message);
  }

  forgotPasswordFail(error:any) {
    //this.loaderService.stop();
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
    if (navigateTo !== undefined ) {
      this._router.navigate([navigateTo]);
    }
  }
  
  goBack() {
    this.commanService.goBack();
    this._router.navigate(['/']);
  }

  closeErrorMessage() {
    this.isShowErrorMessage = true;
  }
}


