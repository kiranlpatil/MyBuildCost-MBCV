import {Component, EventEmitter, Output} from "@angular/core";
import {UserProfile} from "../models/user";
import {DashboardService} from "../dashboard.service";
import {
  AppSettings,
  ImagePath,
  LocalStorage,
  LocalStorageService,
  Message,
  Messages,
  MessageService,
  ProfileService
} from "../../shared/index";


@Component({
  moduleId: module.id,
  selector: 'cn-profile-picture',
  templateUrl: 'profile-picture.component.html',
  styleUrls: ['profile-picture.component.css'],
})

export class ProfilePictureComponent {
  @Output() onPictureUpload = new EventEmitter();
  private model = new UserProfile();
  private filesToUpload: Array<File>;
  private image_path: string;
  private uploaded_image_path: string;
  private isShowErrorMessage: boolean = true;
  private isLoading: boolean = false;
  private isCandidate: string;


  constructor(private dashboardService: DashboardService,
              private messageService: MessageService, private profileService: ProfileService) {
    this.filesToUpload = [];
    this.uploaded_image_path = LocalStorageService.getLocalValue(LocalStorage.PROFILE_PICTURE); //TODO:Get it from get user call.
    this.isCandidate = LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE);
    if (this.uploaded_image_path === "undefined" || this.uploaded_image_path === null) {
      if (this.isCandidate == "true") {
        this.image_path = ImagePath.PROFILE_IMG_ICON;
      }
      else {
        this.image_path = ImagePath.COMPANY_LOGO_IMG_ICON;
      }
    } else {
      this.uploaded_image_path = this.uploaded_image_path.substring(4, this.uploaded_image_path.length - 1).replace('"', '');
      this.image_path = AppSettings.IP + this.uploaded_image_path;
    }

  }


  fileChangeEvent(fileInput: any) {
    this.isLoading = true;
    this.filesToUpload = <Array<File>> fileInput.target.files;
    if (this.filesToUpload[0].type === 'image/jpeg' || this.filesToUpload[0].type === 'image/png'
      || this.filesToUpload[0].type === 'image/jpg' || this.filesToUpload[0].type === 'image/gif') {
      if (this.filesToUpload[0].size <= 5242880) {
        this.dashboardService.makeDocumentUpload(this.filesToUpload, []).then((result: any) => {
          if (result !== null) {
            this.fileChangeSuccess(result);
          }
        }, (error: any) => {
          this.fileChangeFail(error);
        });
      } else {
        var message = new Message();
        message.isError = true;
        message.error_msg = Messages.MSG_ERROR_IMAGE_SIZE;
        this.messageService.message(message);
        this.isLoading = false;
      }
    } else {
      var message = new Message();
      message.isError = true;
      message.error_msg = Messages.MSG_ERROR_IMAGE_TYPE;
      this.messageService.message(message);
      this.isLoading = false;
    }
  }

  fileChangeSuccess(result: any) {
    this.model = result.data;
    LocalStorageService.setLocalValue(LocalStorage.PROFILE_PICTURE, result.data.picture);
    var socialLogin: string = LocalStorageService.getLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.onPictureUpload.emit(result.data.picture);
    }

    if (!this.model.picture || this.model.picture === undefined) {
      this.image_path = ImagePath.PROFILE_IMG_ICON;
    } else if (socialLogin === AppSettings.IS_SOCIAL_LOGIN_YES) {
      this.image_path = this.model.picture;
    } else {
      this.image_path = AppSettings.IP + this.model.picture.substring(4).replace('"', '');
    }
    this.isLoading = false;
    this.profileService.onProfileUpdate(result);
  }

  fileChangeFail(error: any) {
    this.isLoading = true;
    var message = new Message();
    message.isError = true;
    if (error.err_code === 404 || error.err_code === 0) {
      message.error_msg = error.err_msg;
      this.messageService.message(message);
    } else {
      this.isLoading = false;
      message.error_msg = Messages.MSG_ERROR_DASHBOARD_PROFILE_PIC;
      this.messageService.message(message);
    }

  }

}
