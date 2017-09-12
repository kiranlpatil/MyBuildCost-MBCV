import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AppSettings,
    CommonService,
    LocalStorage,
    LocalStorageService,
    Message,
    Messages,
    MessageService,
    ThemeChangeService
} from '../../shared/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from './settings.service';
import { UserProfile } from './../user';
import { ProjectAsset, Headings } from '../../shared/constants';
import { LoaderService } from '../../shared/loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { Candidate, Summary } from '../../../cnext/framework/model/candidate';
import { CandidateProfileService } from '../../../cnext/framework/candidate-profile/candidate-profile.service';
import { ErrorService } from '../../../cnext/framework/error.service';
import { AdminDashboardService } from '../../../cnext/framework/admin-dashboard/admin-dashboard.service';

@Component({
  moduleId: module.id,
  selector: 'tpl-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.css'],
  providers: [SettingsService],
})
export class SettingsComponent implements OnInit, OnDestroy {
  themeIs: string;
  isSocialLogin: boolean;
  model = new UserProfile();
  userForm: FormGroup;
  INITIAL_THEME = AppSettings.INITIAL_THEM;
  LIGHT_THEME = AppSettings.LIGHT_THEM;
  APP_NAME: string;
  changePasswordHeading:string=Headings.CHANGE_PASSWORD;
  changeThemeMessage:string= Messages.MSG_CHANGE_THEME;
    role: string;
    private candidate: Candidate = new Candidate();

    constructor(private commonService: CommonService, private activatedRoute: ActivatedRoute,
                private candidateProfileService: CandidateProfileService,
                private errorService: ErrorService,
                private themeChangeService: ThemeChangeService, private changeThemeServie: SettingsService,
                private messageService: MessageService, private formBuilder: FormBuilder, private loaderService: LoaderService,
                private adminDashboardService: AdminDashboardService) {

    //this.themeIs = LocalStorageService.getLocalValue(LocalStorage.MY_THEME);
    this.themeIs = AppSettings.INITIAL_THEM;

    this.userForm = this.formBuilder.group({
      'current_theme': ['', [Validators.required]]
    });

    this.APP_NAME = ProjectAsset.APP_NAME;
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
      });
    var socialLogin: string = LocalStorageService.getLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
    if (socialLogin === 'YES') {
      this.isSocialLogin = true;
    } else {
      this.isSocialLogin = false;
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
    }

  OnRecruiterDataSuccess(candidateData: any) {
    this.candidate = candidateData.data[0];
    this.candidate.basicInformation = candidateData.metadata;
    this.candidate.summary = new Summary();
  }

  getRecruiter() {
    this.candidateProfileService.getRecruiterDetails()
      .subscribe(
        recruiterData => {
          this.OnRecruiterDataSuccess(recruiterData);
        }, error => this.errorService.onError(error));
  }
  getAdminProfile() {
    this.adminDashboardService.getUserProfile()
      .subscribe(
        userprofile => this.onAdminProfileSuccess(userprofile),
        error => this.errorService.onError(error));
  }
  onAdminProfileSuccess(candidateData: any) {
    this.candidate.basicInformation = candidateData.data;
  }

  ngOnDestroy() {
    //this.loaderService.stop();
  }

  darkTheme() {
    this.themeChangeService.change(this.INITIAL_THEME);
    this.changeThemeServie.chageTheme(this.INITIAL_THEME)
      .subscribe(
        body => this.changeThemeSuccess(body),
        error => this.changeThemeFail(error));
  }

  lightTheme() {
    this.themeChangeService.change(this.INITIAL_THEME);
    this.changeThemeServie.chageTheme(this.INITIAL_THEME)
      .subscribe(
        body => this.changeThemeSuccess(body),
        error => this.changeThemeFail(error));
  }

  goBack() {
    this.commonService.goBack();
  }

  changeThemeSuccess(body: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_CHANGE_THEME;
    this.messageService.message(message);
    this.themeChangeService.change(body.data.current_theme);
    LocalStorageService.setLocalValue(LocalStorage.MY_THEME, body.data.current_theme);
  }

  changeThemeFail(error: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_ERROR_CHANGE_THEME;
    this.messageService.message(message);
  }
}
