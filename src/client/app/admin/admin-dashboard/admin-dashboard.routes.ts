import { Route } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import {KeySkillsDetailListComponent} from "./keyskills-detail-list/keyskills-detail-list.component";
import {RecruiterDetailListComponent} from "./recruiter-detail-list/recruiter-detail-list.component";
import {UsageDetailsComponent} from "./usage-details/usage-details.component";
import {CandidateDetailListComponent} from "./candidate-detail-list/candidate-detail-list.component";
import {AdminAuthGuard} from "../admin-auth-guard.service";

export const AdminDashboard: Route[] = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminAuthGuard],
    children:[
      {path: '',redirectTo: 'candidates',pathMatch: 'full'},
      {path: 'candidates', component: CandidateDetailListComponent},
      {path: 'keyskills', component: KeySkillsDetailListComponent},
      {path: 'recruiters', component: RecruiterDetailListComponent},
      {path: 'usagedetails', component: UsageDetailsComponent}
    ]
  }
];
