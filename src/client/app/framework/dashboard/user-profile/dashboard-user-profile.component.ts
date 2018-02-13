import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DashboardUserProfileService } from './dashboard-user-profile.service';
import { UserProfile } from './../../../user/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../shared/customvalidations/validation.service';
import { NavigationRoutes, Label, Button, Headings } from '../../../shared/constants';
import {
  AppSettings,
  CommonService,
  ImagePath,
  SessionStorage,
  SessionStorageService,
  Message,
  Messages,
  MessageService,
  ProfileService,
  ThemeChangeService
} from '../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'dashboard-user-profile',
  templateUrl: 'dashboard-user-profile.component.html'
})

export class DashboardProfileComponent implements OnInit {

  userForm: FormGroup;
  public submitted: boolean = false;
  public isShowErrorMessage: boolean = true;
  public error_msg: boolean = false;
  showModalStyle: boolean = false;
  showStyleMobile: boolean = false;
  model: UserProfile = new UserProfile();

  constructor(private  dashboardUserProfileService : DashboardUserProfileService, private formBuilder: FormBuilder,
              private messageService: MessageService, private profileService: ProfileService,
              ) {
    this.userForm = this.formBuilder.group({
      'first_name': ['', Validators.required],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'mobile_number': ['', [Validators.required, ValidationService.mobileNumberValidator]],
      'company_name': ['', [Validators.required, ValidationService.alphabatesValidator]],
      'state': ['',[Validators.required, ValidationService.alphabatesValidator]],
      'city': ['', [Validators.required, ValidationService.alphabatesValidator]]
    });
  }

  ngOnInit() {
    this.dashboardUserProfileService.getUserProfile()
      .subscribe(
        (body: any) => this.setUserDetails(body),
        (error: any) => this.failUserDetails(error));
  }

  setUserDetails(body : any) {
    //this.loaderService.stop();
    //this.showHideModal();
    console.log('user Details :\n');
    console.log(JSON.stringify(body.data));
    var user = body.data;
    this.model.first_name = user.first_name;
   /* this.model.last_name = user.last_name;*/
    this.model.email = user.email;
    this.model.mobile_number = user.mobile_number;
    this.model.company_name = user.company_name;
    this.model.state = user.state;
    this.model.city = user.city;
    //this.error_msg = '';
  }

  failUserDetails(error : any) {
    //this.loaderService.stop();
    //this.showHideModal();
    console.log('Error :');
    console.log(JSON.stringify(error));
    //this.error_msg = '';
  }

  onSubmit() {
    this.submitted = true;
    if(this.userForm.valid) {
      this.model = this.userForm.value;
      this.dashboardUserProfileService.updateProfile(this.model)
        .subscribe(
          user => this.onProfileUpdateSuccess(user),
          error => this.onProfileUpdateError(error));
    }
  }

  onProfileUpdateSuccess(result: any) {

    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DASHBOARD_PROFILE;
      this.messageService.message(message);
      this.profileService.onProfileUpdate(result);
    }
  }

  onProfileUpdateError(error: any) {

    var message = new Message();

    if (error.err_code === 404 || error.err_code === 0) {
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
     this.error_msg = error.err_msg;
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    }
  }

  showHideEmailModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  getStyleEmail() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  getStyleMobile() {
    if (this.showStyleMobile) {
      return 'block';
    } else {
      return 'none';
    }
  }
  onPictureUpload(imagePath: string) {
    }

  showHideMobileModal() {
    this.showStyleMobile = !this.showStyleMobile;
  }
  onMobileNumberChangeComplete() {
    this.model.mobile_number = SessionStorageService.getSessionValue(SessionStorage.MOBILE_NUMBER);
    this.showStyleMobile = !this.showStyleMobile;
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
