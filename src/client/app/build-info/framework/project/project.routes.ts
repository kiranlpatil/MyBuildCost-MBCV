import { Route } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectListComponent } from '../project-list/project-list.component';
import { CostSummaryComponent } from './cost-summary-report/cost-summary.component';
import { CostHeadComponent } from './cost-summary-report/cost-head/cost-head.component';
import { MaterialTakeoffComponent } from './material-takeoff/material-takeoff.component';
import { CommonAmenitiesComponent } from './cost-summary-report/common-amenities/common-amenities.component';
import { PayUMoneyComponent } from '../payUMoney/payUMoney.component';

export const ProjectRoutes: Route[] = [
  {
    path: '',
    component: ProjectComponent,
    children:[
      {path: '', component: ProjectComponent},
      {path: 'payment', component: PayUMoneyComponent},
      {path: 'list', component: ProjectListComponent},
      {path: ':projectId/details', component: ProjectDetailsComponent},
      {path: ':projectId/cost-summary', component: CostSummaryComponent},
      {path: ':projectId/:viewType/:viewTypeValue/cost-head/:costHeadName/:costHeadId/category', component: CostHeadComponent},
      {path: ':projectId/material-takeoff', component: MaterialTakeoffComponent},
      {path: ':projectId/cost-summary/common-amenities', component: CommonAmenitiesComponent}
    ]
  }
];
