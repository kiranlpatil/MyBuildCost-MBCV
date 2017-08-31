import {Component, NgZone, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DashboardService} from "../dashboard.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {
  AppSettings,
  CommonService,
  ImagePath,
  LocalStorage,
  LocalStorageService,
  Message,
  Messages,
  MessageService,
  ProfileService,
  ThemeChangeService
} from "../../shared/index";
import {NavigationRoutes} from "../../shared/constants";
import {LoaderService} from "../../shared/loader/loader.service";
import {CandidateDetail} from "../../registration/candidate/candidate";
import {Candidate, Summary} from "../../../cnext/framework/model/candidate";
import {CandidateProfileService} from "../../../cnext/framework/candidate-profile/candidate-profile.service";
import {ErrorService} from "../../../cnext/framework/error.service";


@Component({
  moduleId: module.id,
  selector: 'tpl-dashboard-home',
  templateUrl: 'dashboard-profile.component.html',
  styleUrls: ['dashboard-profile.component.css'],
})

export class DashboardProfileComponent implements OnInit, OnDestroy {

  model = new CandidateDetail();
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
  emailRestMessage:string= Messages.MSG_RESET_EMAIL_ADDRESS;
  mobileNumberRestMessage:string= Messages.MSG_RESET_MOBILE_NUMBER;
  role: string;
  private candidate: Candidate = new Candidate();

  constructor(private commonService: CommonService, private dashboardService: DashboardService,
              private messageService: MessageService, private zone: NgZone, private profileService: ProfileService,
              private _router: Router, private formBuilder: FormBuilder, private loaderService: LoaderService,
              private themeChangeService: ThemeChangeService,
              private activatedRoute: ActivatedRoute,
              private candidateProfileService: CandidateProfileService,
              private errorService: ErrorService,) {

    this.userForm = this.formBuilder.group({
      'first_name': ['', Validators.required],
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
    this.activatedRoute.params.subscribe(params => {
      this.role = params['role'];
      if (this.role) {
        debugger;
        if (this.role === 'candidate') {
          this.getCandidate();
        } else if (this.role === 'recruiter') {
          this.getRecruiter();
        }
      }
    });
    var socialLogin: string = LocalStorageService.getLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
    if (socialLogin === AppSettings.IS_SOCIAL_LOGIN_YES) {
      this.isSocialLogin = true;
    } else {
      this.isSocialLogin = false;
    }
    this.newUser = parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGGED_IN));
    if (this.newUser === 0) {
      this._router.navigate([NavigationRoutes.APP_START]);
    } else {
      //  this.loaderService.start();
      this.getUserProfile();
    }
    document.body.scrollTop = 0;
  }

  getCandidate() {
    this.candidateProfileService.getCandidateDetails()
        .subscribe(
            candidateData => {
              this.OnCandidateDataSuccess(candidateData);
            }, error => this.errorService.onError(error));
  }

  OnCandidateDataSuccess(candidateData: any) {
    this.candidate = candidateData.data[0];
    this.candidate.basicInformation = candidateData.metadata;
    this.candidate.summary = new Summary();
    console.log(this.candidate);
  }

  getRecruiter() {

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
    if (result.data.current_theme) {
      LocalStorageService.setLocalValue(LocalStorage.MY_THEME, result.data.current_theme);
      this.themeChangeService.change(result.data.current_theme);
    }
    if (result !== null) {
      this.model = result.data;
      var socialLogin: string = LocalStorageService.getLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
      if (socialLogin === AppSettings.IS_SOCIAL_LOGIN_YES) {
        this.image_path = this.model.social_profile_picture;
      } else if (this.image_path === undefined && socialLogin !== AppSettings.IS_SOCIAL_LOGIN_YES) {
        this.image_path = ImagePath.PROFILE_IMG_ICON;

      } else if (this.model.picture !== undefined && socialLogin !== AppSettings.IS_SOCIAL_LOGIN_YES) {
        this.image_path = AppSettings.IP + this.model.picture.substring(4).replace('"', '');
      }
    }
  }

  onUserProfileError(error: any) {
    var message = new Message();
    message.isError = true;
    message.error_msg = error.err.msg;
    this.messageService.message(message);
  }

  onSubmit() {
    this.submitted = true;
    this.model = this.userForm.value;
    this.dashboardService.updateProfile(this.model)
      .subscribe(
        user => this.onProfileUpdateSuccess(user),
        error => this.onProfileUpdateError(error));
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
    this.commonService.goBack();
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

  onPictureUpload(imagePath: string) {
    this.candidate.basicInformation.picture = imagePath;
    this.image_path = AppSettings.IP + imagePath.substring(4).replace('"', '');
  }

}
