import { ErrorHandler, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule, Title } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRequestOptions, LoaderService, MessageService, SessionStorageService, ThemeChangeService,
  BaseService, CommonService } from './shared/index';
import { ContactService } from './framework/dashboard/contact/contact.service';
import { ActivateUserComponent } from './framework/registration/activate-user/activate-user.component';
import { ActiveUserService } from './framework/registration/activate-user/activate-user.service';
import { RedirectRecruiterDashboardService } from './user/services/redirect-dashboard.service';
import { LoggerService, MyErrorHandler } from './build-info/framework/my-error-handler.service';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { CustomHttp } from './shared/services/http/custom.http';
import { SharedService } from './shared/services/shared-service';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { HttpDelegateService } from './shared/services/http-delegate.service';
//Application IMPORTS
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ValidationService} from './shared/customvalidations/validation.service';
import {ErrorService} from './shared/services/error.service';
import {UsageTrackingService} from './build-info/framework/usage-tracking.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpModule,
    ReactiveFormsModule,
    SharedModule,
    UserModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    ActivateUserComponent,
    PageNotFoundComponent
  ],
  providers: [
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, MessageService, LoaderService]
    },
    {provide: RequestOptions, useClass: AppRequestOptions},
    LoggerService, {provide: ErrorHandler, useClass: MyErrorHandler},
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    ContactService,
    ActiveUserService,
    RedirectRecruiterDashboardService,
    SharedService,
    Title,
    AuthGuardService,
    HttpDelegateService,
    LoaderService,
    UsageTrackingService,
    ValidationService,
    SessionStorageService,
    MessageService,
    SharedService,
    ThemeChangeService, CommonService, BaseService, CustomHttp, ErrorService, SessionStorageService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions, messageService: MessageService,
                            loaderService: LoaderService) {
  return  new CustomHttp(backend, defaultOptions, messageService, loaderService);
}

