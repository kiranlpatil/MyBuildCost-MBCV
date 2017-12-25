import {ErrorHandler, NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule, Title} from "@angular/platform-browser";
import {APP_BASE_HREF} from "@angular/common";
import {RouterModule} from "@angular/router";
import {routes} from "./app.routes";
import {Http, HttpModule, RequestOptions, XHRBackend} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRequestOptions, LoaderService, MessageService} from "./shared/index";
import {DashboardComponent} from "./framework/dashboard/dashboard.component";
import {AboutComponent} from "./framework/dashboard/about/about.component";
import {ContactComponent} from "./framework/dashboard/contact/contact.component";
import {DashboardHomeComponent} from "./framework/dashboard/dashboard-home/dashboard-home.component";
import {HeaderComponent} from "./framework/shared/header/header.component";
import {NotificationService} from "./framework/shared/notification/notification.service";
import {NotificationComponent} from "./framework/shared/notification/notification.component";
import {SocialIconComponent} from "./framework/shared/footer/social-icon/social-icon.component";
import {DashboardService} from "./user/services/dashboard.service";
import {ContactService} from "./framework/dashboard/contact/contact.service";
import {ActivateUserComponent} from "./framework/registration/activate-user/activate-user.component";
import {ActiveUserService} from "./framework/registration/activate-user/activate-user.service";
import {DateService} from "./cnext/framework/date.service";
import {RoleTypeListComponent} from "./cnext/framework/role-type/role-type.component";
import {RoleTypeService} from "./cnext/framework/role-type/role-type.service";
import {RedirectRecruiterDashboardService} from "./user/services/redirect-dashboard.service";
import {ProfileDetailsService} from "./cnext/framework/profile-detail-service";
import {GuidedTourService} from "./cnext/framework/guided-tour.service";
import {LoggerService, MyErrorHandler} from "./cnext/framework/my-error-handler.service";
import {UserModule} from "./user/user.module";
import {SharedModule} from "./shared/shared.module";
import {CustomHttp} from "./shared/services/http/custom.http";
import {ProfileService} from "./framework/shared/profileservice/profile.service";
import {LandingPageComponent} from "./framework/landing-page/landing-page.component";
import {SharedService} from "./shared/services/shared-service";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {AnalyticService} from "./shared/services/analytic.service";
import { MyDashboardComponent} from "./cnext/framework/my-dashboard/my-dashboard.component";
import {DashboardUserProfileService} from "./framework/dashboard/user-profile/dashboard-user-profile.service";
import {UserChangePasswordService} from "./framework/dashboard/user-change-password/user-change-password.service";
import {AuthGuardService} from "./shared/services/auth-guard.service";

//C-NEXT IMPORTS


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpModule,
    ReactiveFormsModule,
    SharedModule,
    UserModule
  ],
  declarations: [
    AppComponent,
    LandingPageComponent,
    ActivateUserComponent,
    DashboardComponent,
    AboutComponent,
    ContactComponent,
    DashboardHomeComponent,
    HeaderComponent,
    NotificationComponent,
    SocialIconComponent,

    //C-NEXT COMPONENT
    RoleTypeListComponent,
    MyDashboardComponent,
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
    NotificationService,
    DashboardService,
    DashboardUserProfileService,
    UserChangePasswordService,
    ProfileService,
    ContactService,
    ActiveUserService,
    DateService,
    RoleTypeService,
    ProfileDetailsService,
    RedirectRecruiterDashboardService,
    GuidedTourService,
    SharedService,
    Title,
    AnalyticService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions, messageService: MessageService,
                            loaderService: LoaderService) {
  return  new CustomHttp(backend, defaultOptions, messageService, loaderService);
}

