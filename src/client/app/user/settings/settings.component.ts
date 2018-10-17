/*
import {Component, OnInit} from "@angular/core";
import {
  AppSettings,
  CommonService,
  SessionStorage,
  SessionStorageService,
  Message,
  Messages,
  MessageService,
  ThemeChangeService
} from "../../shared/index";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SettingsService} from "./settings.service";
import {UserProfile} from "../models/user";
import {ProjectAsset, Headings} from "../../shared/constants";
import {LoaderService} from "../../shared/loader/loaders.service";
import {ActivatedRoute} from "@angular/router";
import {Candidate, Summary} from "../models/candidate";
import {ErrorService} from "../../shared/services/error.service";

@Component({
  moduleId: module.id,
  selector: 'tpl-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.css'],
  providers: [SettingsService],
})
export class SettingsComponent implements OnInit {
  themeIs: string;
  isSocialLogin: boolean;
  model = new UserProfile();
  userForm: FormGroup;
  INITIAL_THEME = AppSettings.INITIAL_THEM;
  LIGHT_THEME = AppSettings.LIGHT_THEM;
  APP_NAME: string;
  role: string;
  candidate: Candidate = new Candidate();

    constructor(private commonService: CommonService, private activatedRoute: ActivatedRoute,
                private errorService: ErrorService,
                private themeChangeService: ThemeChangeService, private changeThemeServie: SettingsService,
                private messageService: MessageService, private formBuilder: FormBuilder, private loaderService: LoaderService) {

    this.themeIs = AppSettings.INITIAL_THEM;

    this.userForm = this.formBuilder.group({
      'current_theme': ['', [Validators.required]]
    });

    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
          this.role = params['role'];
      });
    var socialLogin: string = SessionStorageService.getSessionValue(SessionStorage.IS_SOCIAL_LOGIN);
    if (socialLogin === 'YES') {
      this.isSocialLogin = true;
    } else {
      this.isSocialLogin = false;
    }
    document.body.scrollTop = 0;
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
  darkTheme() {
    this.themeChangeService.change(this.INITIAL_THEME);
    this.changeThemeServie.changeTheme(this.INITIAL_THEME)
      .subscribe(
        body => this.onChangeThemeSuccess(body),
        error => this.onChangeThemeFailure(error));
  }

  lightTheme() {
    this.themeChangeService.change(this.INITIAL_THEME);
    this.changeThemeServie.changeTheme(this.INITIAL_THEME)
      .subscribe(
        body => this.onChangeThemeSuccess(body),
        error => this.onChangeThemeFailure(error));
  }

  goBack() {
    this.commonService.goBack();
  }

  onChangeThemeSuccess(body: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_CHANGE_THEME;
    this.messageService.message(message);
    this.themeChangeService.change(body.data.current_theme);
    SessionStorageService.setSessionValue(SessionStorage.MY_THEME, body.data.current_theme);
  }

  onChangeThemeFailure(error: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_ERROR_CHANGE_THEME;
    this.messageService.message(message);
  }
  getHeadings() {
    return Headings;
  }
}
*/
