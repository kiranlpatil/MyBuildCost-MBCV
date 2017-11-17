import { Routes } from '@angular/router';
import { DashboardRoutes } from './framework/dashboard/index';
import { StartRoutes } from './framework/start/start.routes';
import { AboutRoutes } from './framework/dashboard/about/index';
import { ActivateUserRoutes } from './framework/registration/activate-user/activate-user.routes';
import { RecruiterDashboard } from './cnext/framework/recruiter-dashboard/recruiter-dashboard.routes';
import { ValuePortrait } from './cnext/framework/value-portrait/value-portrait-container.routes';
import { ShareContainerRoutes } from './cnext/framework/share-container/share-container.routes';
import { JobShareContainerRoutes } from './cnext/framework/job-share-container/job-share-container.routes';
import {CandidateRouteSwitch} from "./cnext/framework/candidate-dashboard/candidate-route-switch.routes";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";


export const routes: Routes = [

  ...ActivateUserRoutes,
  ...DashboardRoutes,
  ...CandidateRouteSwitch,
  ...RecruiterDashboard,
  ...AboutRoutes,
  ...ValuePortrait,
  ...ShareContainerRoutes,
  ...JobShareContainerRoutes,
  ...StartRoutes,
  {
    path:'**',
    component: PageNotFoundComponent
  }
];
