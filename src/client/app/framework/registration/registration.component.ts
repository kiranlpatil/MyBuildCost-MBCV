import {  Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from './registration.service';
import { Registration } from './registration';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../shared/customvalidations/validation.service';
import {
  Message,
  MessageService,
  CommonService,
  NavigationRoutes,
  AppSettings
 } from '../shared/index';
import { ImagePath, LocalStorage, ProjectAsset } from '../shared/constants';
import { LocalStorageService } from '../shared/localstorage.service';
import {LoaderService} from "../shared/loader/loader.service";


@Component({
  moduleId: module.id,
  selector: 'tpl-registration',
  templateUrl: 'registration.component.html',
  styleUrls: ['registration.component.css'],
})

export class RegistrationComponent {
  model = new Registration();
  isPasswordConfirm: boolean;
  isFormSubmitted = false;
  userForm: FormGroup;
  error_msg: string;
  isCandidate:boolean =false;
  //isCandidate:boolean = true;
  isRecruiter:boolean = true;
  isShowErrorMessage: boolean = true;
  BODY_BACKGROUND:string;

  constructor(private commanService: CommonService, private _router: Router,
              private registrationService: RegistrationService, private messageService: MessageService, private formBuilder: FormBuilder,private loaderService:LoaderService) {

    /*this.userForm = this.formBuilder.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'mobile_number': ['', [Validators.required, ValidationService.mobileNumberValidator]],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'password': ['', [Validators.required, Validators.minLength(8)]],
      'conform_password': ['', [Validators.required, Validators.minLength(8)]]
    });*/

    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  onSubmit() {
    this.model = this.userForm.value;
    this.model.current_theme = AppSettings.LIGHT_THEM;
    if (!this.makePasswordConfirm()) {
      this.isFormSubmitted = true;
     // this.loaderService.start();
      this.registrationService.addRegistration(this.model)
        .subscribe(
          user => this.onRegistrationSuccess(user),
          error => this.onRegistrationError(error));
    }
  }

  onRegistrationSuccess(user: any) {
    //this.loaderService.stop();
    LocalStorageService.setLocalValue(LocalStorage.USER_ID, user.data._id);
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID,this.userForm.value.email);
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, this.userForm.value.mobile_number);
    LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_registration');
    this.userForm.reset();
    this._router.navigate([NavigationRoutes.VERIFY_USER]);
  }

  onRegistrationError(error: any) {
   // this.loaderService.stop();
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
    this.commanService.goBack();
    this._router.navigate(['/']);
  }

  navigateTo(navigateTo: string) {
    if (navigateTo !== undefined ) {
      this._router.navigate([navigateTo]);
    }
  }
  makePasswordConfirm(): boolean {
    if (this.model.conform_password !== this.model.password) {
      this.isPasswordConfirm = true;
      return true;
    } else {
      this.isPasswordConfirm = false;
      return false;
    }
  }

  showHideEmployee() {
    this.isCandidate =!this.isCandidate;
  }

  showHideCandidate() {
    this.isCandidate = false;
    this.isRecruiter = true;
  }

  showHideRecruiter() {
    this.isRecruiter = false;
    this.isCandidate = true;
  }

  closeErrorMessage() {
    this.isShowErrorMessage = true;
  }

}
