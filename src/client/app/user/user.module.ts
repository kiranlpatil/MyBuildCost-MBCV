import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {LoginService} from "./../framework/login/login.service";
import {UserHeaderComponent} from "./user-header/user-header.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegistrationService} from "./services/registration.service";
import {UserChangePasswordService} from "./../framework/dashboard/user-change-password/user-change-password.service";
import {UserRoutingModule} from "./user.routing.module";
import { LoginauthGuard } from './../framework/login/login-auth-guard.service';
import {DashboardHeaderComponent} from "../framework/dashboard/dashboard-header/dashboard-header.component";
import {ProjectHeaderComponent} from "../build-info/framework/project-header/project-header.component";
import {ProjectListHeaderComponent} from "../build-info/framework/project-header/project-list-header/project-list-header.component";
import {ProjectFormComponent} from "../build-info/framework/shared/project-form/project-form.component";
import {ProjectImageComponent} from "../build-info/framework/project/project-image/project-image.component";
import {BuildingFormComponent} from "../build-info/framework/shared/building-form/building-form.component";
import {ProjectService} from "../build-info/framework/project/project.service";
import {BuildingService} from "../build-info/framework/project/building/building.service";
import {CostSummaryService} from "../build-info/framework/project/cost-summary-report/cost-summary.service";
import {MaterialTakeOffService} from "../build-info/framework/project/material-takeoff/material-takeoff.service";
import {ProjectNameChangeService} from "../shared/services/project-name-change.service";
import {AdvertisingBannerService} from "../build-info/framework/project/advertising-banner/advertising-banner.service";
import {ProjectImageService} from "../build-info/framework/project/project-image/project-image.service";
import {DashboardService} from "./services/dashboard.service";
import {DashboardUserProfileService} from "../framework/dashboard/user-profile/dashboard-user-profile.service";
import {ProfileService} from "../framework/shared/profileservice/profile.service";
import {ProfileDetailsService} from "../build-info/framework/profile-detail-service";
import {PackageDetailsService} from "../build-info/framework/package-details/package-details.service";
import {RenewPackageService} from "../build-info/framework/package-details/renew-package/renew-package.service";
import {PayUMoneyService} from "../build-info/framework/payUMoney/payUMoney.service";
import {PackageDetailsComponent} from "../build-info/framework/package-details/package-details.component";
import {PackageDefaultComponent} from "../build-info/framework/package-details/packageDefault.component";
import {PackageSummaryComponent} from "../build-info/framework/package-details/package-summary/package-summary.component";
import {RenewPackageComponent} from "../build-info/framework/package-details/renew-package/renew-package.component";
import {PaymentSuccessfulComponent} from "../build-info/framework/payment/payment-successful/payment-successful.component";
import {PaymentFailureComponent} from "../build-info/framework/payment/payment-failure/payment-failure.component";
import {RetainProjectComponent} from "../build-info/framework/payment/retain-project/retain-project.component";

@NgModule({
  imports: [CommonModule,FormsModule,SharedModule,ReactiveFormsModule, /*TODO Abhijeet Ng2AutoCompleteModule,*/ UserRoutingModule],
  declarations: [UserHeaderComponent,
    ProjectHeaderComponent,
    DashboardHeaderComponent,ProjectListHeaderComponent,
    BuildingFormComponent,
    ProjectFormComponent,
    ProjectImageComponent,
    PackageDetailsComponent,
    PackageDefaultComponent,
    PackageSummaryComponent,
    RenewPackageComponent,
    PaymentSuccessfulComponent,
    PaymentFailureComponent,
    RetainProjectComponent],
  exports: [UserHeaderComponent,
    ProjectHeaderComponent,
    DashboardHeaderComponent,ProjectListHeaderComponent,
    BuildingFormComponent,
    ProjectFormComponent,
    ProjectImageComponent,
    PackageDetailsComponent,
    PackageDefaultComponent,
    PackageSummaryComponent,
    RenewPackageComponent,
    PaymentSuccessfulComponent,
    PaymentFailureComponent,
    RetainProjectComponent],
  providers: [
    RegistrationService,
    LoginService,
    UserChangePasswordService,
    LoginauthGuard,
    ProjectService,
    BuildingService,
    CostSummaryService,
    MaterialTakeOffService,
    ProjectNameChangeService,
    AdvertisingBannerService,
    ProjectImageService,
    DashboardService,
    DashboardUserProfileService,
    UserChangePasswordService,
    ProfileService,
    ProfileDetailsService,
    PackageDetailsService,
    RenewPackageService,
    PayUMoneyService
  ]
})

export class UserModule {

}
