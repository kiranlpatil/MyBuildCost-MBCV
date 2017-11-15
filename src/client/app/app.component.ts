import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {ThemeChangeService} from "./shared/services/themechange.service";
import {
  AppSettings,
  CommonService,
  LoaderService,
  Message,
  MessageService
} from "./shared/index";



@Component({
  moduleId: module.id,
  selector: 'tpl-app',
  templateUrl: 'app.component.html',
})

export class AppComponent implements OnInit {
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
          let err = message.error_msg.error;
          if (err === 'Could not attach click handler to the element. Reason: element not found.') {
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

  ngOnInit() {
  }

  showError(message: Message) {
    this.isShowErrorMessage = false;
    this.errorMessage = message.error_msg;
    this.customMessage = message.custom_message;
    if(message.error_code===401) {
      setTimeout(function () {
        this.closeErrorMessage();
        this.logOut();
      }.bind(this), 5555);
    }
  }

  showSuccess(message: Message) {
    this.isShowSuccessMessage = false;
    this.customMessage = message.custom_message;
    setTimeout(function () {
      this.isShowSuccessMessage = true;
    }.bind(this), 8888);
  };

  closeErrorMessage() {
    this.isShowErrorMessage = true;
  }

  closeSuccessMessage() {
    this.isShowSuccessMessage = true;
  }
  logOut() {
    window.localStorage.clear();
    let host = AppSettings.HTTP_CLIENT + AppSettings.HOST_NAME;
    window.location.href = host;
  }
}
