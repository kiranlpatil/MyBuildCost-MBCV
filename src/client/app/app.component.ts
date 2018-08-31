import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ThemeChangeService } from './shared/services/themechange.service';
import {
  AppSettings,
  CommonService,
  LoaderService,
  Message,
  MessageService
} from './shared/index';
import { Messages, NavigationRoutes } from './shared/constants';



@Component({
  moduleId: module.id,
  selector: 'tpl-app',
  templateUrl: 'app.component.html',
})

export class AppComponent {
  subscription: Subscription;
  appTheme: string;
  errorMessage: any;
  customMessage: any;
  isShowErrorMessage: boolean = true;
  isShowSuccessMessage: boolean = true;

  constructor(private _router: Router,
              private themeChangeService: ThemeChangeService,
              private messageService: MessageService,
              private commonService: CommonService,
              protected loaderService: LoaderService) {
    this.appTheme = AppSettings.INITIAL_THEM;

    this.subscription = themeChangeService.showTheme$.subscribe(
      theme => {
        this.appTheme = theme;
      });

    this.subscription = messageService.messageObservable$.subscribe(
      (message: Message) => {
        if (message.isError === true) {
          let err = message.error_msg;
          if (err === 'Could not attach click handler to the selectedElement. Reason: selectedElement not found.') {
            message.isError = false;
          } else {
            this.showError(message);
          }
        } else {
          this.showSuccess(message);
        }
      }
    );
  }

  showError(message: Message) {
    this.isShowErrorMessage = false;
    this.errorMessage = message.error_msg;
    if(message.error_code===500) {
      this.errorMessage= Messages.MSG_ERROR_UNCAUGHT_EXCEPTION;
    }
    this.customMessage = message.custom_message;
    var timeout =8888;
    if(message.error_code===401 || message.error_msg===Messages.MSG_ERROR_UNAUTHORIZED) {
      this.errorMessage= Messages.MSG_ERROR_UNAUTHORIZED_FOR_USER;
      timeout=3333;
    }
    setTimeout(function () {
      this.closeErrorMessage();
      if(message.error_code===401 || message.error_msg===Messages.MSG_ERROR_UNAUTHORIZED) {
        this.logOut();
      }
    }.bind(this), timeout);
  }

  showSuccess(message: Message) {
    this.isShowSuccessMessage = false;
    this.customMessage = message.custom_message;
    setTimeout(function () {
      this.isShowSuccessMessage = true;
    }.bind(this), 8888);
  }

  closeErrorMessage() {
    this.isShowErrorMessage = true;
  }

  closeSuccessMessage() {
    this.isShowSuccessMessage = true;
  }
  logOut() {
    window.sessionStorage.clear();
    window.localStorage.clear();
    let host = AppSettings.HTTP_CLIENT + AppSettings.HOST_NAME;
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }
}
