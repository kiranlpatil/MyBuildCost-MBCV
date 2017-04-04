import {    Component, OnInit  } from '@angular/core';
import {  Router  } from '@angular/router';
import {  MessageService  } from '../../../shared/message.service';
import {  LocalStorageService  } from '../../../shared/localstorage.service';
import {  LocalStorage, NavigationRoutes  } from '../../../shared/index';
import {  ResetPasswordService  } from './reset-password.service';
import {  Messages, ImagePath, ProjectAsset  } from '../../../shared/constants';
import {  Message  } from '../../../shared/message';
import {  ResetPassword  } from './reset-password';
import {  FormGroup, FormBuilder, Validators  } from '@angular/forms';


@Component({
    moduleId: module.id,
    selector: 'tpl-reset-password',
    templateUrl: 'reset-password.component.html',
    styleUrls: ['reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
    error_msg:string;
    isShowErrorMessage:boolean = true;
    token:string;
    idPosition:number;
    id:string;
    model = new ResetPassword();
    userForm:FormGroup;
    isPasswordConfirm:boolean;
    MY_LOGO_PATH:string;
    APP_NAME:string;
    MY_TAG_LINE:string;
    UNDER_LICENCE:string;
    BODY_BACKGROUND:string;

    constructor(private _router:Router, private messageService:MessageService,
                private resetPasswordService:ResetPasswordService, private formBuilder:FormBuilder) {

        this.userForm = this.formBuilder.group({
            'new_password': ['', [Validators.required, Validators.minLength(8)]],
            'confirm_password': ['', [Validators.required, Validators.minLength(8)]]
        });

        this.MY_LOGO_PATH = ImagePath.MY_WHITE_LOGO;
        this.APP_NAME = ProjectAsset.APP_NAME;
        this.MY_TAG_LINE = ProjectAsset.TAG_LINE;
        this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
        this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    }


    ngOnInit() {
        this.token = this._router.url.substr('reset_password?access_token'.length + 2);
        this.idPosition = this.token.indexOf('&') + 1;
        this.id = this.token.substring(this.idPosition + 28, this.idPosition + 4);
        this.token = this.token.substring(this.token.length - 29, 0);
        LocalStorageService.setLocalValue(LocalStorage.ACCESS_TOKEN, this.token);
        LocalStorageService.setLocalValue(LocalStorage.USER_ID, this.id);
    }

    onSubmit() {
        this.model = this.userForm.value;
        if (!this.makePasswordConfirm()) {
            this.resetPasswordService.newPassword(this.model)
                .subscribe(
                    res => (this.newPasswordSuccess(res)),
                    error => (this.newPasswordFail(error)));
        }
    }

    newPasswordSuccess(res:any) {
        var message = new Message();
        message.isError = false;
        message.custom_message = Messages.MSG_SUCCESS_RESET_PASSWORD;
        this.messageService.message(message);
        this._router.navigate([NavigationRoutes.APP_LOGIN]);

    }

    newPasswordFail(error:any) {
        if (error.err_code === 404 || error.err_code === 0) {
            var message = new Message();
            message.error_msg = error.err_msg;
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

    makePasswordConfirm():boolean {
        if (this.model.confirm_password !== this.model.new_password) {
            this.isPasswordConfirm = true;
            return true;
        } else {
            this.isPasswordConfirm = false;
            return false;
        }
    }

    closeErrorMessage() {
        this.isShowErrorMessage = true;
    }
}

