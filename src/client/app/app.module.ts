import { ErrorHandler, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule, Title } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRequestOptions, LoaderService, MessageService } from './shared/index';
import { DashboardComponent } from './framework/dashboard/dashboard.component';
import { AboutComponent } from './framework/dashboard/about/about.component';
import { ContactComponent } from './framework/dashboard/contact/contact.component';
import { DashboardHomeComponent } from './framework/dashboard/dashboard-home/dashboard-home.component';
import { HeaderComponent } from './framework/shared/header/header.component';
import { NotificationService } from './framework/shared/notification/notification.service';
import { NotificationComponent } from './framework/shared/notification/notification.component';
import { SocialIconComponent } from './framework/shared/footer/social-icon/social-icon.component';
import { DashboardService } from './user/services/dashboard.service';
import { ContactService } from './framework/dashboard/contact/contact.service';
import { ActivateUserComponent } from './framework/registration/activate-user/activate-user.component';
import { ActiveUserService } from './framework/registration/activate-user/activate-user.service';
import { DateService } from './build-info/framework/date.service';
import { RoleTypeListComponent } from './build-info/framework/role-type/role-type.component';
import { RoleTypeService } from './build-info/framework/role-type/role-type.service';
import { RedirectRecruiterDashboardService } from './user/services/redirect-dashboard.service';
import { ProfileDetailsService } from './build-info/framework/profile-detail-service';
import { GuidedTourService } from './build-info/framework/guided-tour.service';
import { LoggerService, MyErrorHandler } from './build-info/framework/my-error-handler.service';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { CustomHttp } from './shared/services/http/custom.http';
import { ProfileService } from './framework/shared/profileservice/profile.service';
import { LandingPageComponent } from './framework/landing-page/landing-page.component';
import { SharedService } from './shared/services/shared-service';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { AnalyticService } from './shared/services/analytic.service';
import { CommonAmenitiesComponent } from './build-info/framework/project/cost-summary-report/common-amenities/common-amenities.component';
//import { MyDashboardComponent} from "./build-info/framework/my-dashboard/my-dashboard.component";
import { CommonAmenitiesService } from './build-info/framework/project/cost-summary-report/common-amenities/common-amenities.service';
import { DashboardHeaderComponent } from './framework/dashboard/dashboard-header/dashboard-header.component';
import { DashboardUserProfileService } from './framework/dashboard/user-profile/dashboard-user-profile.service';
import { UserChangePasswordService } from './framework/dashboard/user-change-password/user-change-password.service';
import { AuthGuardService } from './shared/services/auth-guard.service';

//Application IMPORTS

import { ProjectService } from './build-info/framework/project/project.service';
import { ProjectComponent } from './build-info/framework/project/project.component';
import { CreateProjectComponent } from './build-info/framework/project/create-project/create-project.component';
import { CreateProjectService } from './build-info/framework/project/create-project/create-project.service';
import { BuildingComponent } from './build-info/framework/project/building/building.component';
import { CreateBuildingComponent } from './build-info/framework/project/building/create-building/create-building.component';
import { BuildingService } from './build-info/framework/project/building/building.service';
import { CreateBuildingService } from './build-info/framework/project/building/create-building/create-building.service';
import { ProjectListComponent } from './build-info/framework/project/project-list/project-list.component';
import { ProjectListService } from './build-info/framework/project/project-list/project-list.service';
import { ProjectDetailsComponent } from './build-info/framework/project/project-details/project-details.component';
import { ProjectDetailsService } from './build-info/framework/project/project-details/project-details.service';
import { BuildingListComponent } from './build-info/framework/project/building/buildings-list/building-list.component';
import { BuildingDetailsComponent } from './build-info/framework/project/building/building-details/building-details.component';
import { BuildingListService } from './build-info/framework/project/building/buildings-list/building-list.service';
import { BuildingDetailsService } from './build-info/framework/project/building/building-details/building-details.service';
import { ProjectHeaderComponent } from './build-info/framework/project/project-header/project-header.component';
import { ProjectContentComponent } from './build-info/framework/project/project-content/project-content.component';
import { CostSummaryComponent } from './build-info/framework/project/cost-summary-report/cost-summary.component';
import { CostSummaryService } from './build-info/framework/project/cost-summary-report/cost-summary.service';
import { MaterialTakeoffComponent } from './build-info/framework/project/material-takeoff/material-takeoff.component';
import { MaterialTakeoffService } from './build-info/framework/project/material-takeoff/material-takeoff.service';
import { CostHeadComponent } from './build-info/framework/project/cost-summary-report/cost-head/cost-head.component';
import { CostHeadService } from './build-info/framework/project/cost-summary-report/cost-head/cost-head.service';
import { CostSummaryPipe } from './build-info/framework/project/cost-summary-report/cost-summary.pipe';
import { GetQuantityComponent } from './build-info/framework/project/cost-summary-report/cost-head/get-quantity/get-quantity.component';
import { GetQuantityService } from './build-info/framework/project/cost-summary-report/cost-head/get-quantity/get-quantity.service';
import { ProjectListHeaderComponent } from './build-info/framework/project/project-header/project-list-header/project-list-header.component';
import { ProjectListHeaderService } from './build-info/framework/project/project-header/project-list-header/project-list-header.service';

// Import the Animations module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GetRateComponent } from './build-info/framework/project/cost-summary-report/cost-head/get-rate/get-rate.component';
import { GetRateService } from './build-info/framework/project/cost-summary-report/cost-head/get-rate/get-rate.service';
import { CreateNewProjectComponent } from './build-info/framework/create-new-project/create-new-project.component';

// Import the ButtonsModule
//import { ButtonsModule } from '@progress/kendo-angular-buttons';

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
    LandingPageComponent,
    ActivateUserComponent,
    DashboardComponent,
    AboutComponent,
    ContactComponent,
    DashboardHomeComponent,
    HeaderComponent,
    NotificationComponent,
    SocialIconComponent,

    //Application COMPONENT
    RoleTypeListComponent,
    DashboardHeaderComponent,
    ProjectComponent,
    BuildingComponent,
    CreateNewProjectComponent,
    CreateProjectComponent,
    ProjectListComponent,
    CreateBuildingComponent,
    ProjectDetailsComponent,
    BuildingListComponent,
    ProjectHeaderComponent,
    ProjectListHeaderComponent,
    ProjectContentComponent,
    BuildingDetailsComponent,
    CostSummaryComponent,
    CostHeadComponent,
    CostSummaryPipe,
    GetQuantityComponent,
    MaterialTakeoffComponent,
    GetRateComponent,
    //MyDashboardComponent,
    PageNotFoundComponent,
    CommonAmenitiesComponent
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
    AuthGuardService,

    //Application Services
    ProjectService,
    BuildingService,
    CreateBuildingService,
    CreateProjectService,
    ProjectDetailsService,
    ProjectListService,
    BuildingListService,
    BuildingDetailsService,
    CostSummaryService,
    CostHeadService,
    MaterialTakeoffService,
    GetQuantityService,
    CommonAmenitiesService,
    GetRateService,
    ProjectListHeaderService
    // MaterialTakeoffService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions, messageService: MessageService,
                            loaderService: LoaderService) {
  return  new CustomHttp(backend, defaultOptions, messageService, loaderService);
}

