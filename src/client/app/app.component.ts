import {  Component, OnInit  } from '@angular/core';
import {  Router  } from '@angular/router';
import {  Subscription  } from 'rxjs/Subscription';
import {  ThemeChangeService  } from './framework/shared/themechange.service';
import {
    AppSettings,
    Message,
    LocalStorageService,
    NavigationRoutes,
    MessageService,
    CommonService,
    LocalStorage,
    LoaderService
 } from './framework/shared/index';


@Component({
    moduleId: module.id,
    selector: 'tpl-app',
    templateUrl: 'app.component.html',
})

export class AppComponent implements OnInit {
    subscription:Subscription;
    appTheme:string;
    errorMessage:any;
    customMessage:any;
    isShowErrorMessage:boolean = true;
    isShowSuccessMessage:boolean = true;

    constructor(private _router:Router,
                private themeChangeService:ThemeChangeService,
                private messageService:MessageService,
                private commonService:CommonService,
                protected loaderService:LoaderService) {
        this.appTheme = AppSettings.INITIAL_THEM;
        if (parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGED_IN)) === 1) {
          if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==='true') {
            this._router.navigate(['/create_profile']);
          } else {
            this._router.navigate(['/recruiterdashboard']);
            // this._router.navigate(['/dashboard']);
            //this._router.navigate([NavigationRoutes.APP_COMPANYDETAILS]);
          }

        } else {
            LocalStorageService.setLocalValue(LocalStorage.IS_LOGED_IN, 0);
        }
        this.subscription = themeChangeService.showTheme$.subscribe(
            theme => {
                this.appTheme = theme;
            });

        this.subscription = messageService.messageObservable$.subscribe(
            (message:Message) => {
                if (message.isError === true) {
                let err = message.error_msg.error;
                  if(err === 'Could not attach click handler to the element. Reason: element not found.') {
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
        if (LocalStorageService.getLocalValue(LocalStorage.ACCESS_TOKEN) === null) {
           // this._router.navigate([NavigationRoutes.APP_COMPANYDETAILS]);
          this._router.navigate([NavigationRoutes.APP_CREATEPROFILE]);
        } else {
           // this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
          // this._router.navigate([NavigationRoutes.APP_COMPANYDETAILS]);

        }
    }

    showError(message:Message) {
      this.isShowErrorMessage = false;
      this.errorMessage = message.error_msg;
      this.customMessage = message.custom_message;
    };

    showSuccess(message:Message) {
        this.isShowSuccessMessage = false;
        console.log('Success message',message);
        this.customMessage = message.custom_message;
        setTimeout(function () {
            this.isShowSuccessMessage = true;
        }.bind(this), 5555);
    };

    closeErrorMessage() {
        this.isShowErrorMessage = true;
    }

    closeSuccessMessage() {
        this.isShowSuccessMessage = true;
    }

}
