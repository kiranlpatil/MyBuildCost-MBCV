import {NgModule} from "@angular/core";
import {AdminDashboard} from "./admin-dashboard/admin-dashboard.routes";
import {RouterModule} from "@angular/router";

@NgModule({
  imports : [
    RouterModule.forChild([
      ...AdminDashboard
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class AdminModuleRoutes {
}
