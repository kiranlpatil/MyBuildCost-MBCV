import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {LandingPageRoutes} from "../framework/landing-page/landing-page.routes";
import {PackageDetailsRoutes} from "../build-info/framework/package-details/package-details.routes";

@NgModule({
  imports: [
    RouterModule.forChild([
      ...LandingPageRoutes,
      ...PackageDetailsRoutes

  ])
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule {
}
