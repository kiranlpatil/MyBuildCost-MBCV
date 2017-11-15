import { Routes } from '@angular/router';
import { DashboardRoutes } from './framework/dashboard/index';
import { StartRoutes } from './framework/start/start.routes';
import { AboutRoutes } from './framework/dashboard/about/index';
import { ActivateUserRoutes } from './framework/registration/activate-user/activate-user.routes';
import { RecruiterDashboard } from './cnext/framework/recruiter-dashboard/recruiter-dashboard.routes';
import { CandidateSummary } from './cnext/framework/one-page-summary/candidate-summary/candidate-summary.routes';
import { RecruiterSummary } from './cnext/framework/one-page-summary/recruiter-job-summary/recruiter-job-summary.routes';
import { ValuePortrait } from './cnext/framework/value-portrait/value-portrait-container.routes';
import { ShareContainerRoutes } from './cnext/framework/share-container/share-container.routes';
import { JobShareContainerRoutes } from './cnext/framework/job-share-container/job-share-container.routes';
import {CandidateRouteSwitch} from "./cnext/framework/candidate-dashboard/candidate-route-switch.routes";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";


export const routes: Routes = [

  {
    path: 'admin',
    loadChildren: '/app/admin/admin.module#AdminModule'
  },
  ...ActivateUserRoutes,  //Check usage
  ...DashboardRoutes,
  ...CandidateRouteSwitch,
  ...RecruiterDashboard,
  ...RecruiterSummary,
  ...AboutRoutes,
  ...CandidateSummary,
  ...ValuePortrait,
  ...ShareContainerRoutes,
  ...JobShareContainerRoutes,
  ...StartRoutes,
  {
    path:'**',
    component: PageNotFoundComponent
  }
];
