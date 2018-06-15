import { Route } from '@angular/router';
import { PackageDetailsComponent } from './package-details.component';
import { PackageSummaryComponent } from './package-summary/package-summary.component';
import { RenewPackageComponent } from './renew-package/renew-package.component';
import { PackageDefaultComponent } from './packageDefault.component';
import { PaymentSuccessfulComponent } from '../payment/payment-successful/payment-successful.component';
import { RetainProjectComponent } from "../payment/retain-project/retain-project.component";
import {PaymentFailureComponent} from "../payment/payment-failure/payment-failure.component";

export const PackageDetailsRoutes: Route[] = [
  {
    path: 'package-details',
    component: PackageDefaultComponent,
    children:[
      {path: '', component: PackageDetailsComponent},
      {path: 'premium-package/:packageName/:premiumPackageExist', component: PackageSummaryComponent},
      {path: 'renew-package/:projectId/:projectName/:numOfDaysToExpire', component: RenewPackageComponent},
      {path: 'payment/:packageName/success', component: PaymentSuccessfulComponent},
      //{ path :'payment/failure',component :PaymentFailureComponent },
      { path: 'retain-project/:projectName',component :RetainProjectComponent}]
  }
];



