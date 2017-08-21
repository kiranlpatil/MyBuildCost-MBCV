import {Component, OnDestroy, OnInit} from "@angular/core";
import {
  AppSettings,
  CommonService,
  LocalStorage,
  LocalStorageService,
  Message,
  Messages,
  MessageService,
  ThemeChangeService
} from "../../shared/index";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SettingsService} from "./settings.service";
import {UserProfile} from "./../user";
import {ProjectAsset} from "../../shared/constants";
import {LoaderService} from "../../shared/loader/loader.service";

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
  changePasswordMessage:string= Messages.MSG_CHANGE_PASSWORD;
  changeThemeMessage:string= Messages.MSG_CHANGE_THEME;

  constructor(private commonService: CommonService, private themeChangeService: ThemeChangeService, private changeThemeServie: SettingsService,
              private messageService: MessageService, private formBuilder: FormBuilder, private loaderService: LoaderService) {

    //this.themeIs = LocalStorageService.getLocalValue(LocalStorage.MY_THEME);
    this.themeIs = AppSettings.INITIAL_THEM;

    this.userForm = this.formBuilder.group({
      'current_theme': ['', [Validators.required]]
    });

    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  ngOnInit() {

    var socialLogin: string = LocalStorageService.getLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
    if (socialLogin === 'YES') {
      this.isSocialLogin = true;
    } else {
      this.isSocialLogin = false;
    }
    document.body.scrollTop = 0;
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
