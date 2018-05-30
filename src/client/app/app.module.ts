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
import { RedirectRecruiterDashboardService } from './user/services/redirect-dashboard.service';
import { ProfileDetailsService } from './build-info/framework/profile-detail-service';
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
import { DashboardHeaderComponent } from './framework/dashboard/dashboard-header/dashboard-header.component';
import { DashboardUserProfileService } from './framework/dashboard/user-profile/dashboard-user-profile.service';
import { UserChangePasswordService } from './framework/dashboard/user-change-password/user-change-password.service';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { HttpDelegateService } from './shared/services/http-delegate.service';


//Application IMPORTS

import { ProjectService } from './build-info/framework/project/project.service';
import { ProjectComponent } from './build-info/framework/project/project.component';
import { CreateProjectComponent } from './build-info/framework/create-project/create-project.component';
import { BuildingComponent } from './build-info/framework/project/building/building.component';
import { CreateBuildingComponent } from './build-info/framework/project/building/create-building/create-building.component';
import { BuildingService } from './build-info/framework/project/building/building.service';
import { ProjectListComponent } from './build-info/framework/project-list/project-list.component';
import { ProjectDetailsComponent } from './build-info/framework/project/project-details/project-details.component';
import { BuildingListComponent } from './build-info/framework/project/building/buildings-list/building-list.component';
import { BuildingDetailsComponent } from './build-info/framework/project/building/building-details/building-details.component';
import { ProjectHeaderComponent } from './build-info/framework/project-header/project-header.component';
import { CostSummaryComponent } from './build-info/framework/project/cost-summary-report/cost-summary.component';
import { CostSummaryService } from './build-info/framework/project/cost-summary-report/cost-summary.service';
import { MaterialTakeoffComponent } from './build-info/framework/project/material-takeoff/material-takeoff.component';
import { CostHeadWiseReportComponent } from './build-info/framework/project/material-takeoff/material-take-off-report/cost-head-wise-report/cost-head-wise-report.component';
import { MaterialWiseReportComponent } from './build-info/framework/project/material-takeoff/material-take-off-report/material-wise-report/material-wise-report.component';
import { MaterialTakeOffService } from './build-info/framework/project/material-takeoff/material-takeoff.service';
import { MaterialTakeOffReportComponent }
from './build-info/framework/project/material-takeoff/material-take-off-report/material-take-off-report.component';
import { TableRowComponent } from './build-info/framework/project/material-takeoff/material-take-off-report/row/row.component';
import { CostHeadComponent } from './build-info/framework/project/cost-summary-report/cost-head/cost-head.component';
import { CostSummaryPipe } from './build-info/framework/project/cost-summary-report/cost-summary.pipe';
import { GetQuantityComponent } from './build-info/framework/project/cost-summary-report/cost-head/get-quantity/get-quantity.component';
import { ProjectListHeaderComponent } from './build-info/framework/project-header/project-list-header/project-list-header.component';
import { GroupByPipe } from '../app/shared/services/custom-pipes/groupby.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GetRateComponent } from './build-info/framework/project/cost-summary-report/cost-head/get-rate/get-rate.component';
import { CreateNewProjectComponent } from './build-info/framework/create-new-project/create-new-project.component';
import { ProjectItemComponent } from './build-info/framework/project-list/project-item/project-item.component';
import { DeleteConfirmationModalComponent } from './shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { UpdateConfirmationModalComponent } from './shared/update-confirmation-modal/update-confirmation-modal.component';
import { ProjectFormComponent } from './build-info/framework/shared/project-form/project-form.component';
import { BuildingFormComponent } from './build-info/framework/shared/building-form/building-form.component';
import { QuantityDetailsComponent }
from './build-info/framework/project/cost-summary-report/cost-head/quantity-details/quantity-details.component';
import { CostHeadReportComponent } from './build-info/framework/project/report-templates/cost-head-report/cost-head-report.component';
import { AttachmentComponent } from './build-info/framework/project/cost-summary-report/cost-head/attachment/attachment.component';
import { MaterialTakeOffPdfReportComponent }
from './build-info/framework/project/report-templates/material-take-off-report/material-take-off-pdf-report.component';
import { CostHeadWiseTableViewComponent }
from './build-info/framework/project/report-templates/material-take-off-report/cost-head-wise-table-view/cost-head-wise-table-view.component';
import { MaterialWiseTableViewComponent }
from './build-info/framework/project/report-templates/material-take-off-report/material-wise-table-view/material-wise-table-view.component';
import { PdfHeaderComponent }
from './build-info/framework/project/report-templates/material-take-off-report/pdf-header/pdf-header.component';
import { CommonAmenitiesReportComponent }
from './build-info/framework/project/report-templates/common-amenities-report/common-amenities-report.component';
import { CloneBuildingComponent} from './build-info/framework/project/building/clone-building/clone-building.component';
import { ProjectNameChangeService } from './shared/services/project-name-change.service';
import {CostSummaryReportComponent} from './build-info/framework/project/report-templates/cost-summary-report/cost-summary-report.component';
import { DisclaimerComponent } from './shared/disclaimer-component/disclaimer-component';
import {
  SortByCategoryAmountPipe} from './build-info/framework/project/cost-summary-report/cost-head/sort-by-category-amount.pipe';

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
    DashboardHeaderComponent,
    ProjectComponent,
    BuildingComponent,
    CreateNewProjectComponent,
    CreateProjectComponent,
    ProjectListComponent,
    CreateBuildingComponent,
    CloneBuildingComponent,
    ProjectDetailsComponent,
    BuildingListComponent,
    ProjectHeaderComponent,
    ProjectListHeaderComponent,
    BuildingDetailsComponent,
    CostSummaryComponent,
    CostHeadComponent,
    CostSummaryPipe,
    SortByCategoryAmountPipe,
    GetQuantityComponent,
    MaterialTakeoffComponent,
    CostHeadWiseReportComponent,
    MaterialWiseReportComponent,
    MaterialTakeOffReportComponent,
    MaterialTakeOffPdfReportComponent,
    CostHeadWiseTableViewComponent,
    MaterialWiseTableViewComponent,
    PdfHeaderComponent,
    TableRowComponent,
    GetRateComponent,
    ProjectItemComponent,
    QuantityDetailsComponent,
    //MyDashboardComponent,

    //Shared Components
    GroupByPipe,
    DeleteConfirmationModalComponent,
    UpdateConfirmationModalComponent,
    DisclaimerComponent,
    ProjectFormComponent,
    BuildingFormComponent,

    //report pdf
    CostHeadReportComponent,

    PageNotFoundComponent,
    CommonAmenitiesComponent,
    CostSummaryReportComponent,
    AttachmentComponent,
    CommonAmenitiesReportComponent
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
    ProfileDetailsService,
    RedirectRecruiterDashboardService,
    SharedService,
    Title,
    AnalyticService,
    AuthGuardService,
    HttpDelegateService,

    //Application Services
    ProjectService,
    BuildingService,
    CostSummaryService,
    MaterialTakeOffService,
    ProjectNameChangeService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions, messageService: MessageService,
                            loaderService: LoaderService) {
  return  new CustomHttp(backend, defaultOptions, messageService, loaderService);
}

