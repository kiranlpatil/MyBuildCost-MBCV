/**
 * Created by lenovo on 11-09-2016.
 */
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import {RouterModule, Routes} from "@angular/router";
import {DashboardRoutes} from "./dashboard.routes";
import {DashboardProfileComponent} from "./user-profile/dashboard-user-profile.component";
import {UserChangePasswordComponent} from "./user-change-password/user-change-password.component";
import {ContactComponent} from "./contact/contact.component";
import {BillingDetailsComponent} from "./billing-details/billing-details.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {DashboardHomeComponent} from "./dashboard-home/dashboard-home.component";
import {UserModule} from "../../user/user.module";
import {AmountValidationDirective} from "../../build-info/framework/project/amount-validation.directive";
import {PayUMoneyComponent} from "../../build-info/framework/payUMoney/payUMoney.component";
import {PaymentFailureComponent} from "../../build-info/framework/payment/payment-failure/payment-failure.component";
import {RetainProjectComponent} from "../../build-info/framework/payment/retain-project/retain-project.component";
import {RenewPackageComponent} from "../../build-info/framework/package-details/renew-package/renew-package.component";
import {PaymentSuccessfulComponent} from "../../build-info/framework/payment/payment-successful/payment-successful.component";
import {PackageDefaultComponent} from "../../build-info/framework/package-details/packageDefault.component";
import {PackageSummaryComponent} from "../../build-info/framework/package-details/package-summary/package-summary.component";
import {PackageDetailsComponent} from "../../build-info/framework/package-details/package-details.component";
import {AdvertisingBannerComponent} from "../../build-info/framework/project/advertising-banner/advertising-banner.component";
import {CommonAmenitiesReportComponent} from "../../build-info/framework/project/report-templates/common-amenities-report/common-amenities-report.component";
import {AttachmentComponent} from "../../build-info/framework/project/cost-summary-report/cost-head/attachment/attachment.component";
import {CostSummaryReportComponent} from "../../build-info/framework/project/report-templates/cost-summary-report/cost-summary-report.component";
import {CommonAmenitiesComponent} from "../../build-info/framework/project/cost-summary-report/common-amenities/common-amenities.component";
import {CompleteProjectReportComponent} from "../../build-info/framework/project/report-templates/complete-project-report/complete-project-report.component";
import {CostHeadReportComponent} from "../../build-info/framework/project/report-templates/cost-head-report/cost-head-report.component";
import {DisclaimerComponent} from "../../shared/disclaimer-component/disclaimer-component";
import {CreateProjectConfirmationModalComponent} from "../../shared/create-project-confirmation-modal/create-project-confirmation-modal.component";
import {UpdateConfirmationModalComponent} from "../../shared/update-confirmation-modal/update-confirmation-modal.component";
import {DeleteConfirmationModalComponent} from "../../shared/delete-confirmation-modal/delete-confirmation-modal.component";
import {GroupByPipe} from "../../shared/services/custom-pipes/groupby.pipe";
import {CostDistributionChartComponent} from "../../build-info/framework/project/cost-distribution-chart/cost-distribution-chart.component";
import {QuantityDetailsComponent} from "../../build-info/framework/project/cost-summary-report/cost-head/quantity-details/quantity-details.component";
import {ProjectItemComponent} from "../../build-info/framework/project-list/project-item/project-item.component";
import {GetRateComponent} from "../../build-info/framework/project/cost-summary-report/cost-head/get-rate/get-rate.component";
import {TableRowComponent} from "../../build-info/framework/project/material-takeoff/material-take-off-report/row/row.component";
import {PdfHeaderComponent} from "../../build-info/framework/project/report-templates/material-take-off-report/pdf-header/pdf-header.component";
import {MaterialWiseTableViewComponent} from "../../build-info/framework/project/report-templates/material-take-off-report/material-wise-table-view/material-wise-table-view.component";
import {CostHeadWiseTableViewComponent} from "../../build-info/framework/project/report-templates/material-take-off-report/cost-head-wise-table-view/cost-head-wise-table-view.component";
import {MaterialTakeOffPdfReportComponent} from "../../build-info/framework/project/report-templates/material-take-off-report/material-take-off-pdf-report.component";
import {MaterialTakeOffReportComponent} from "../../build-info/framework/project/material-takeoff/material-take-off-report/material-take-off-report.component";
import {MaterialWiseReportComponent} from "../../build-info/framework/project/material-takeoff/material-take-off-report/material-wise-report/material-wise-report.component";
import {CostHeadWiseReportComponent} from "../../build-info/framework/project/material-takeoff/material-take-off-report/cost-head-wise-report/cost-head-wise-report.component";
import {MaterialTakeoffComponent} from "../../build-info/framework/project/material-takeoff/material-takeoff.component";
import {GetSteelQuantityComponent} from "../../build-info/framework/project/cost-summary-report/cost-head/get-quantity-steel/get-quantity-steel.component";
import {GetQuantityComponent} from "../../build-info/framework/project/cost-summary-report/cost-head/get-quantity/get-quantity.component";
import {SortByCategoryAmountPipe} from "../../build-info/framework/project/cost-summary-report/cost-head/sort-by-category-amount.pipe";
import {CostSummaryPipe} from "../../build-info/framework/project/cost-summary-report/cost-summary.pipe";
import {CostHeadComponent} from "../../build-info/framework/project/cost-summary-report/cost-head/cost-head.component";
import {CostSummaryComponent} from "../../build-info/framework/project/cost-summary-report/cost-summary.component";
import {ProjectDetailsComponent} from "../../build-info/framework/project/project-details/project-details.component";
import {ProjectListComponent} from "../../build-info/framework/project-list/project-list.component";
import {CreateNewProjectComponent} from "../../build-info/framework/create-new-project/create-new-project.component";
import {ProjectComponent} from "../../build-info/framework/project/project.component";
import {PackageDetailsRoutes} from "../../build-info/framework/package-details/package-details.routes";
import {CreateNewProjectRoutes} from "../../build-info/framework/create-new-project/create-new-project.routes";
import {ProjectRoutes} from '../../build-info/framework/project/project.routes';
import {ChangeEmailComponent} from "../../user/settings/change-email/change-email.component";
import {ChangeEmailRoutes} from "../../user/settings/change-email/change-email.routes";
import {ChangeEmailService} from "../../user/settings/change-email/change-email.service";
import {CloneBuildingComponent} from "../../build-info/framework/project/building/clone-building/clone-building.component";
import {CloneBuildingRoutes} from "../../build-info/framework/project/building/clone-building/clone-building.routes";

export const rout: Routes = [

  ...DashboardRoutes,
  ...ProjectRoutes,
  ...CreateNewProjectRoutes,
  ...ChangeEmailRoutes,
  ...CloneBuildingRoutes
];




@NgModule({
  imports: [UserModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(rout)
  ],
  declarations: [
    CloneBuildingComponent,

    DashboardComponent,
    DashboardHomeComponent,DashboardProfileComponent,
    UserChangePasswordComponent,ContactComponent,
    BillingDetailsComponent,
    ProjectComponent,
    CreateNewProjectComponent,
    ProjectListComponent,
    ProjectDetailsComponent,
   CostSummaryComponent,
    CostHeadComponent,
    CostSummaryPipe,
    SortByCategoryAmountPipe,
    GetQuantityComponent,
    GetSteelQuantityComponent,
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
    CostDistributionChartComponent,
    GroupByPipe,
    DeleteConfirmationModalComponent,
    UpdateConfirmationModalComponent,
    CreateProjectConfirmationModalComponent,
    DisclaimerComponent,
    CostHeadReportComponent,
    CompleteProjectReportComponent,
    CommonAmenitiesComponent,
    CostSummaryReportComponent,
    AttachmentComponent,
    CommonAmenitiesReportComponent,
    AdvertisingBannerComponent,
    PayUMoneyComponent,
    AmountValidationDirective,
    //ProjectHeaderComponent,
    //ProjectListHeaderComponent,
    //ProjectFormComponent,
    //ProjectImageComponent,
    //BuildingFormComponent,
    ChangeEmailComponent,
  ],
  providers :[ChangeEmailService
      /*//ProjectService,
      BuildingService,
      //CostSummaryService,
      MaterialTakeOffService,
      //ProjectNameChangeService,
      AdvertisingBannerService,
      ProjectImageService,
    DashboardService,
    DashboardUserProfileService,
    UserChangePasswordService,
    //ProfileService,
    ProfileDetailsService,
    PackageDetailsService,
    RenewPackageService,
    PayUMoneyService*/]
})
export class DashboardModule {
}
