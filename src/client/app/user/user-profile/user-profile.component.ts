import {Component, NgZone, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DashboardService} from "../services/dashboard.service";
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
import {NavigationRoutes, Label, Button, Headings} from "../../shared/constants";
import {LoaderService} from "../../shared/loader/loaders.service";
import {CandidateDetail} from "../models/candidate-details";
import {Candidate, Summary} from "../models/candidate";
import {CandidateProfileService} from "../../cnext/framework/candidate-profile/candidate-profile.service";
import {ErrorService} from "../../shared/services/error.service";


@Component({
  moduleId: module.id,
  selector: 'cn-dashboard-home',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['user-profile.component.css'],
})

export class UserProfileComponent implements OnInit {

  model = new CandidateDetail();
  submitted = false;
  isSocialLogin: boolean;
  isCompanyWebsiteValid: boolean=true;
  userForm: FormGroup;
  recruiterForm: FormGroup;
  filesToUpload: Array<File>;
  image_path: any;
  error_msg: string;
  company_website:string;
  company_name:string;
  isShowErrorMessage: boolean = true;
  newUser: number;
  showModalStyle: boolean = false;
  showStyleMobile: boolean = false;
  showStyleCompanyWebsite: boolean = false;
  FIRST_NAME_ICON: string;
  LAST_NAME_ICON: string;
  MOBILE_ICON: string;
  EMAIL_ICON: string;
  role: string;
  private candidate: Candidate = new Candidate();

  constructor(private commonService: CommonService, private dashboardService: DashboardService,
              private messageService: MessageService, private zone: NgZone, private profileService: ProfileService,
              private _router: Router, private formBuilder: FormBuilder, private loaderService: LoaderService,
              private themeChangeService: ThemeChangeService,
              private activatedRoute: ActivatedRoute,
              private candidateProfileService: CandidateProfileService,
              private errorService: ErrorService) {

    this.userForm = this.formBuilder.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'mobile_number': ['', [Validators.required, ValidationService.mobileNumberValidator]]


    });
    this.recruiterForm = this.formBuilder.group({
      'company_name': ['', Validators.required],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'mobile_number': ['', [Validators.required, ValidationService.mobileNumberValidator]],
      'company_website': ['']


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
        if (this.role === 'candidate') {
          this.getCandidate();
        } else if (this.role === 'recruiter') {
          this.getRecruiter();
        }
      }
      LocalStorageService.setLocalValue(LocalStorage.ROLE_NAME, this.role);
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
      //this.getUserProfile();
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

  getRecruiter() {
    this.candidateProfileService.getRecruiterDetails()
      .subscribe(
        recruiterData => {
          this.company_website=recruiterData.data[0].company_website;
          this.company_name=recruiterData.data[0].company_name;
          this.OnCandidateDataSuccess(recruiterData);
        }, error => this.errorService.onError(error));
  }

  OnCandidateDataSuccess(candidateData: any) {
    this.candidate = candidateData.data[0];
    this.candidate.basicInformation = candidateData.metadata;
    this.candidate.summary = new Summary();
    this.model.email= LocalStorageService.getLocalValue(LocalStorage.EMAIL_ID);
    this.model.mobile_number = LocalStorageService.getLocalValue(LocalStorage.MOBILE_NUMBER);
    if (candidateData.metadata != undefined && candidateData.metadata != null) {
      if (candidateData.metadata.current_theme) {
        LocalStorageService.setLocalValue(LocalStorage.MY_THEME, candidateData.metadata.current_theme);
        this.themeChangeService.change(candidateData.metadata.current_theme);
      }
      this.model = candidateData.metadata;
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

  onSubmit() {
    this.submitted = true;
    if(this.role === 'candidate' && this.userForm.valid) {
      this.model = this.userForm.value;
      this.dashboardService.updateProfile(this.model)
        .subscribe(
          user => this.onProfileUpdateSuccess(user),
          error => this.onProfileUpdateError(error));
    }else if(this.recruiterForm.valid) {
      this.model = this.recruiterForm.value;
     if( this.model.company_website===''||
       (this.model.company_website!=='' && this.model.company_website.match('[a-zA-Z0-9_\\-]+\\.[a-zA-Z0-9_\\-]+\\.[a-zA-Z0-9_\\-]'))) {
       this.isCompanyWebsiteValid=true;
      this.dashboardService.changeRecruiterAccountDetails(this.model)
        .subscribe(
          user => this.onProfileUpdateSuccess(user),
          error => this.onProfileUpdateError(error));
    }else {
       this.isCompanyWebsiteValid=false;
     }
    }
  }
  onCompnayWebsite() {
    this.isCompanyWebsiteValid=true;
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

  showHideCompanyWebsiteModal() {
    this.showStyleCompanyWebsite = !this.showStyleCompanyWebsite;
  }
  showHideMobileModal() {
    this.showStyleMobile = !this.showStyleMobile;
  }
  getStyleCompanyWebsite() {
    if (this.showStyleCompanyWebsite) {
      return 'block';
    } else {
      return 'none';
    }
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
    if(this.role ==='candidate') {
      this.candidate.basicInformation.picture = imagePath;
    this.image_path = AppSettings.IP + imagePath.substring(4).replace('"', '');
    } else if (this.role ==='recruiter') {
      this.candidate.basicInformation.picture = LocalStorageService.getLocalValue(LocalStorage.PROFILE_PICTURE); //TODO:Get it from get user call.
      this.image_path = AppSettings.IP + imagePath.substring(4).replace('"', '');
      if (this.candidate.basicInformation.picture === 'undefined' || this.candidate.basicInformation.picture === null) {
        this.candidate.basicInformation.picture = ImagePath.COMPANY_LOGO_IMG_ICON;
      } else {
        this.candidate.basicInformation.picture = this.candidate.basicInformation.picture.substring(4, this.candidate.basicInformation.picture.length - 1).replace('"', '');
        this.candidate.basicInformation.picture = AppSettings.IP + this.candidate.basicInformation.picture;
      }
    }
  }
  onCompanyWebsiteUpdate(event:any) {
    this.showStyleCompanyWebsite=false;
    this.company_website=event;

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
