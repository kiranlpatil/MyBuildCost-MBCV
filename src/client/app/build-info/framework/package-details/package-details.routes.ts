import { Route } from '@angular/router';
import { PackageDetailsComponent } from './package-details.component';
import { PackageSummaryComponent } from './package-summary/package-summary.component';
import {PackageDefaultComponent} from "./packageDefault.component";

export const PackageDetailsRoutes: Route[] = [
  {
    path: 'package-details',
    component: PackageDefaultComponent,
    children:[
      {path: '', component: PackageDetailsComponent},
      {path: 'premium-package/:packageName', component: PackageSummaryComponent}]
  }
];



