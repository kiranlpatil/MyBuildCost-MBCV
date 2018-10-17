///<reference path="buildings-list/building-list.component.ts"/>
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {BuildingRoutes} from "./building.routes";
import {BuildingComponent} from "./building.component";
import {BuildingListComponent} from "./buildings-list/building-list.component";
import {BuildingDetailsComponent} from "./building-details/building-details.component";
import {SharedModule} from "../../../../shared/shared.module";
import {UserModule} from "../../../../user/user.module";
import {CloneBuildingComponent} from "./clone-building/clone-building.component";
import {DashboardModule} from "../../../../framework/dashboard/dashboard.module";

@NgModule({
  imports: [CommonModule,DashboardModule,UserModule,SharedModule,RouterModule.forChild(BuildingRoutes)],
  declarations: [BuildingComponent,
    //CreateBuildingComponent,
    BuildingListComponent,
    BuildingDetailsComponent,
    CloneBuildingComponent
  ]
})

export class BuildingModule {

}
