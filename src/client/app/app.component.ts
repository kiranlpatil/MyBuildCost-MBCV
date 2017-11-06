import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {ThemeChangeService} from "./shared/services/themechange.service";
import {
  AppSettings,
  CommonService,
  LoaderService,
  LocalStorage,
  LocalStorageService,
  Message,
  MessageService,
  NavigationRoutes
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
    if (window.location.href.indexOf('/share/') === -1) {
    if (window.location.href.indexOf('/editJob/') === -1) {
      if (parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGGED_IN)) === 1) {
        if (LocalStorageService.getLocalValue(LocalStorage.ISADMIN) === 'true') {
          this._router.navigate([NavigationRoutes.APP_ADMIN_DASHBOARD]);
        } else {
          if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
            if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE_SUBMITTED) === 'true') {
              this._router.navigate([NavigationRoutes.APP_CANDIDATE_DASHBOARD]);
            } else {
              this._router.navigate([NavigationRoutes.APP_CREATEPROFILE]);
            }
          } else {
            this._router.navigate([NavigationRoutes.APP_RECRUITER_DASHBOARD]);
          }
        }
      } else {
        LocalStorageService.setLocalValue(LocalStorage.IS_LOGGED_IN, 0);
      }
    }
}

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

    /* this.subscription = loaderService.showLoader$.subscribe(
     isShowLoader => {
     this.loading = isShowLoader;
     });*/

  }

  ngOnInit() {
    /* if (LocalStorageService.getLocalValue(LocalStorage.ACCESS_TOKEN) === null) {
     // this._router.navigate([NavigationRoutes.APP_COMPANYDETAILS]);
     this._router.navigate([NavigationRoutes.APP_CREATEPROFILE]);
     } else {
     // this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
     // this._router.navigate([NavigationRoutes.APP_COMPANYDETAILS]);

     }*/
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
  };

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
    let host = AppSettings.HTTP_CLIENT + window.location.hostname;
    window.location.href = host;
  }
}
