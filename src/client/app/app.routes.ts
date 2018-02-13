import { Routes } from '@angular/router';
import { DashboardRoutes } from './framework/dashboard/index';
//import { MyDashboardRoutes } from './cnext/framework/my-dashboard/index';
import { StartRoutes } from './framework/start/start.routes';
import { AboutRoutes } from './framework/dashboard/about/index';
import { ActivateUserRoutes } from './framework/registration/activate-user/activate-user.routes';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ProjectRoutes } from './build-info/framework/project/project.routes';
import { BuildingRoutes } from './build-info/framework/project/building/building.routes';
import { LandingPageRoutes } from './framework/landing-page/landing-page.routes';
import { CreateNewProjectRoutes } from './build-info/framework/create-new-project/create-new-project.routes';
import { CreateProjectRoutes } from './build-info/framework/project/create-project/create-project.routes';
import { CreateBuildingRoutes } from './build-info/framework/project/building/create-building/create-building.routes';


export const routes: Routes = [

  ...ActivateUserRoutes,
  ...DashboardRoutes,
  //...MyDashboardRoutes,
  ...AboutRoutes,
  ...ProjectRoutes,
  ...LandingPageRoutes,
  ...BuildingRoutes,
  ...CreateProjectRoutes,
  ...CreateBuildingRoutes,
  ...CreateNewProjectRoutes,
  ...StartRoutes,
  {
    path:'**',
    component: PageNotFoundComponent
  }
];
