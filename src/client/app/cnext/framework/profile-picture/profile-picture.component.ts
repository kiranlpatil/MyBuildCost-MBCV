import { Component } from '@angular/core';
import {UserProfile} from "../../../framework/dashboard/user";
import {DashboardService} from "../../../framework/dashboard/dashboard.service";
import {
    Message,
    MessageService,
    Messages,
    ProfileService,
    AppSettings,
    ImagePath,
    LocalStorage,
    LocalStorageService
} from '../../../framework/shared/index';


@Component({
    moduleId: module.id,
    selector: 'cn-profile-picture',
    templateUrl: 'profile-picture.component.html',
    styleUrls: ['profile-picture.component.css'],
})

export class ProfilePictureComponent  {

  private model = new UserProfile();
  private filesToUpload: Array<File>;
  private   image_path: any;
  private isShowErrorMessage: boolean = true;


  constructor(private dashboardService: DashboardService,
              private messageService: MessageService, private profileService: ProfileService) {
    this.filesToUpload = [];
    if (this.image_path === undefined) {
      this.image_path = ImagePath.PROFILE_IMG_ICON;
    }

  }


  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files;
    if (this.filesToUpload[0].type === 'image/jpeg' || this.filesToUpload[0].type === 'image/png'
      || this.filesToUpload[0].type === 'image/jpg' || this.filesToUpload[0].type === 'image/gif') {
      if (this.filesToUpload[0].size <= 5000000) {
        this.dashboardService.makePictureUplaod(this.filesToUpload, []).then((result: any) => {
          if (result !== null) {
            this.fileChangeSucess(result);
          }
        }, (error:any) => {
          this.fileChangeFail(error);
        });
      } else {
        var message = new Message();
        message.isError = true;
        message.error_msg = Messages.MSG_ERROR_IMAGE_SIZE;
        this.messageService.message(message);
      }
    } else {
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
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DASHBOARD_PROFILE_PIC;
    this.messageService.message(message);
    this.profileService.onProfileUpdate(result);
  }

  fileChangeFail(error: any) {
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

}
