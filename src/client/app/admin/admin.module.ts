import {NgModule} from "@angular/core";
import {UserModule} from "../user/user.module";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {AdminModuleRoutes} from "./admin.routing";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {CandidateDetailListComponent} from "./admin-dashboard/candidate-detail-list/candidate-detail-list.component";
import {RecruiterDetailListComponent} from "./admin-dashboard/recruiter-detail-list/recruiter-detail-list.component";
import {KeyskillsDetailListComponent} from "./admin-dashboard/keyskills-detail-list/keyskills-detail-list.component";
import {UsageDetailsComponent} from "./admin-dashboard/usage-details/usage-details.component";
import {FilterBarComponent} from "./admin-dashboard/filter-bar/filter-bar.component";

@NgModule({
  imports : [CommonModule, SharedModule, UserModule, AdminModuleRoutes],
  declarations : [AdminDashboardComponent,
    CandidateDetailListComponent,
    RecruiterDetailListComponent,
    KeyskillsDetailListComponent,
    UsageDetailsComponent, FilterBarComponent],
  exports : [],
  providers : []
})

export class AdminModule {

}
