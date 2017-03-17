import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { UserProfile } from '../user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../shared/customvalidations/validation.service';
import {
  Message,
  MessageService,
  CommonService,
  Messages,
  ProfileService,
  AppSettings,
  ImagePath,
  LocalStorage,
  ThemeChangeService,
  LocalStorageService
} from '../../shared/index';
import { NavigationRoutes } from '../../shared/constants';
import {LoaderService} from "../../shared/loader/loader.service";


@Component({
  moduleId: module.id,
  selector: 'tpl-dashboard-home',
  templateUrl: 'dashboard-profile.component.html',
  styleUrls: ['dashboard-profile.component.css'],
})

export class DashboardProfileComponent implements OnInit,OnDestroy {

  model = new UserProfile();
  submitted = false;
  isSocialLogin: boolean;
  userForm: FormGroup;
  filesToUpload: Array<File>;
  image_path: any;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  newUser: number;
  showModalStyle: boolean = false;
  showStyleMobile: boolean = false;
  FIRST_NAME_ICON: string;
  LAST_NAME_ICON: string;
  MOBILE_ICON: string;
  EMAIL_ICON: string;

  constructor(private commanService: CommonService, private dashboardService: DashboardService,
              private messageService: MessageService, private zone: NgZone, private profileService: ProfileService,
              private _router: Router, private formBuilder: FormBuilder, private loaderService: LoaderService,
              private themeChangeService: ThemeChangeService) {

    this.userForm = this.formBuilder.group({
      'company_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'mobile_number': ['', [Validators.required, ValidationService.mobileNumberValidator]]

    });
    this.filesToUpload = [];
    if (this.image_path === undefined) {
      this.image_path = ImagePath.PROFILE_IMG_ICON;
    }

    this.EMAIL_ICON = ImagePath.EMAIL_ICON_GREY;
    this.FIRST_NAME_ICON = ImagePath.FIRST_NAME_ICON_GREY;
    this.LAST_NAME_ICON = ImagePath.LAST_NAME_ICON_GREY;
    this.MOBILE_ICON = ImagePath.MOBILE_ICON_GREY;
  }

  ngOnInit() {
    var socialLogin: string = LocalStorageService.getLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
    if (socialLogin === AppSettings.IS_SOCIAL_LOGIN_YES) {
      this.isSocialLogin = true;
    } else {
      this.isSocialLogin = false;
    }
    this.newUser = parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGED_IN));
    if (this.newUser === 0) {
      this._router.navigate([NavigationRoutes.APP_START]);
    } else {
      //  this.loaderService.start();
      this.getUserProfile();
    }
    document.body.scrollTop = 0;
  }

  ngOnDestroy() {
    //this.loaderService.stop();
  }

  getUserProfile() {
    this.dashboardService.getUserProfile()
      .subscribe(
        userprofile => this.onUserProfileSuccess(userprofile),
        error => this.onUserProfileError(error));
  }

  onUserProfileSuccess(result: any) {
    //this.loaderService.stop();

    if (result.data.current_theme) {
      LocalStorageService.setLocalValue(LocalStorage.MY_THEME, result.data.current_theme);
      this.themeChangeService.change(result.data.current_theme);
    }
    if (result !== null) {
      this.model = result.data;
      var socialLogin:string = LocalStorageService.getLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
      if (socialLogin === AppSettings.IS_SOCIAL_LOGIN_YES) {
        this.image_path = this.model.social_profile_picture;
      }  else if (this.image_path === undefined && socialLogin !== AppSettings.IS_SOCIAL_LOGIN_YES) {
        this.image_path = ImagePath.PROFILE_IMG_ICON;

      }  else if (this.model.picture !== undefined && socialLogin !== AppSettings.IS_SOCIAL_LOGIN_YES) {
        this.image_path = AppSettings.IP + this.model.picture.substring(4).replace('"', '');
      }
    }
  }

  onUserProfileError(error: any) {
    //this.loaderService.stop();

    var message = new Message();
    message.isError = true;
    message.error_msg = error.err.msg;
    this.messageService.message(message);
  }

  onSubmit() {
    this.submitted = true;
    //this.loaderService.start();
    this.model = this.userForm.value;
    this.dashboardService.updateProfile(this.model)
      .subscribe(
        user => this.onProfileUpdateSuccess(user),
        error => this.onProfileUpdateError(error));
  }

  onProfileUpdateSuccess(result: any) {
    // this.loaderService.stop();

    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DASHBOARD_PROFILE;
      this.messageService.message(message);
      this.profileService.onProfileUpdate(result);
    }
  }

  onProfileUpdateError(error: any) {
    // this.loaderService.stop();

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

  goBack() {
    this.commanService.goBack();
  }

  fileChangeEvent(fileInput: any) {
    // this.loaderService.start();
    //var inputValue = fileInput.target;
    this.filesToUpload = <Array<File>> fileInput.target.files;
    if (this.filesToUpload[0].type === 'image/jpeg' || this.filesToUpload[0].type === 'image/png'
      || this.filesToUpload[0].type === 'image/jpg' || this.filesToUpload[0].type === 'image/gif') {
      if (this.filesToUpload[0].size <= 500000) {
        this.dashboardService.makePictureUplaod(this.filesToUpload, []).then((result: any) => {
          if (result !== null) {
            this.fileChangeSucess(result);
          }
        }, (error) => {
          this.fileChangeFail(error);
        });
      } else {
        // this.loaderService.stop();
        var message = new Message();
        message.isError = true;
        message.error_msg = Messages.MSG_ERROR_IMAGE_SIZE;
        this.messageService.message(message);
      }
    } else {
      //this.loaderService.stop();

      var message = new Message();
      message.isError = true;
      message.error_msg = Messages.MSG_ERROR_IMAGE_TYPE;
      this.messageService.message(message);
    }
  }

  fileChangeSucess(result: any) {
    this.model = result.data;
    var socialLogin:string = LocalStorageService.getLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
    if (!this.model.picture || this.model.picture === undefined) {
      this.image_path = ImagePath.PROFILE_IMG_ICON;
    }  else if(socialLogin === AppSettings.IS_SOCIAL_LOGIN_YES) {
      this.image_path = this.model.picture;
    } else {
      this.image_path = AppSettings.IP + this.model.picture.substring(4).replace('"', '');
    }
    //this.loaderService.stop();

    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DASHBOARD_PROFILE_PIC;
    this.messageService.message(message);
    this.profileService.onProfileUpdate(result);
  }

  fileChangeFail(error: any) {
    // this.loaderService.stop();

    var message = new Message();
    message.isError = true;
    if (error.err_code === 404 || error.err_code === 0) {

      message.error_msg = error.err_msg;
      this.messageService.message(message);
    } else {

      message.error_msg = Messages.MSG_ERROR_DASHBOARD_PROFILE_PIC;
      this.messageService.message(message);
    }

  }

  closeErrorMessage() {
    this.isShowErrorMessage = true;
  }

  showHideEmailModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  showHideMobileModal() {
    this.showStyleMobile = !this.showStyleMobile;
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

}
