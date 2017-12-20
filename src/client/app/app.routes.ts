import { Routes } from '@angular/router';
import { DashboardRoutes } from './framework/dashboard/index';
import { MyDashboardRoutes } from './cnext/framework/my-dashboard/index';
import { StartRoutes } from './framework/start/start.routes';
import { AboutRoutes } from './framework/dashboard/about/index';
import { ActivateUserRoutes } from './framework/registration/activate-user/activate-user.routes';
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";


export const routes: Routes = [

  ...ActivateUserRoutes,
  ...DashboardRoutes,
  ...MyDashboardRoutes,
  ...AboutRoutes,
  ...StartRoutes,
  {
    path:'**',
    component: PageNotFoundComponent
  }
];
