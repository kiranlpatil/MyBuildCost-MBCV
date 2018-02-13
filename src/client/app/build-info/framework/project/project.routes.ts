import { Route } from '@angular/router';
import { ProjectComponent } from './project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { CostSummaryComponent } from './cost-summary-report/cost-summary.component';
import { CostHeadComponent } from './cost-summary-report/cost-head/cost-head.component';
import { MaterialTakeoffComponent } from './material-takeoff/material-takeoff.component';
import { CommonAmenitiesComponent } from './cost-summary-report/common-amenities/common-amenities.component';

export const ProjectRoutes: Route[] = [
  {
    path: 'project',
    component: ProjectComponent,
    children:[
      {path: '', component: ProjectComponent},
      {path: 'list', component: ProjectListComponent},
      {path: 'details/:projectId', component: ProjectDetailsComponent},
      /*{path: 'create', component: CreateProjectComponent},*/
      {path: 'cost-summary/:projectId', component: CostSummaryComponent},
      {path: 'cost-summary/cost-head/:projectId/:buildingName/:costHeadName/:costHeadId', component: CostHeadComponent},
      {path: 'material-takeoff/:projectId', component: MaterialTakeoffComponent},
      {path: 'cost-summary/common-amenities/:projectId', component: CommonAmenitiesComponent}
    ]
  }
];
