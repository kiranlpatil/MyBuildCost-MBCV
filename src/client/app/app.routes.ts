import { Routes } from '@angular/router';
import { StartRoutes } from './framework/start/start.routes';
import { ActivateUserRoutes } from './framework/registration/activate-user/activate-user.routes';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { LandingPageRoutes } from './framework/landing-page/landing-page.routes';
import {HomePageRoutes} from './framework/home-page/home-page.routes';
import { AdminRoutes } from './build-info/framework/admin/admin.routes';


export const routes: Routes = [
  ...HomePageRoutes,
  ...LandingPageRoutes,
  ...StartRoutes,
  ...AdminRoutes,
  ...ActivateUserRoutes,
  /*{
    path:'dashboard',
    loadChildren: 'app/framework/dashboard/dashboard.module#DashboardModule'
  },{
    path:'building',
    loadChildren: 'app/build-info/framework/project/building/building.module#BuildingModule'
  },
  {
    path:'project',
    loadChildren: 'app/framework/dashboard/dashboard.module#DashboardModule'
  },
  {
    path:'create-project',
    loadChildren: 'app/build-info/framework/create-project/create-project.module#CreateProjectModule'
  },
  {
    path:'create-building',
    loadChildren: 'app/build-info/framework/project/building/create-building/create-building.module#CreateBuildingModule'
  },
  {
    path:'create-new-project',
    loadChildren: 'app/framework/dashboard/dashboard.module#DashboardModule'
  }/!*,
  {
    path:'package-details',
    loadChildren: 'app/framework/dashboard/dashboard.module#DashboardModule'
  }*!/,
  {
    path:'reset-password',
    loadChildren: 'app/framework/login/forgot-password/reset-password/reset-password.module#ResetPasswordModule'
  },
  {
    path:'forgot-password',
    loadChildren: 'app/framework/login/forgot-password/forgot-password.module#ForgotPasswordModule'
  },
  {
    path:'signin',
    loadChildren: 'app/framework/login/login.module#LoginModule'
  },
  {
    path:'registration',
    loadChildren: 'app/framework/registration/candidate-sign-up/candidate-sign-up.module#CandidateSignUpModule'
  },*/
  {
    path:'**',
    component: PageNotFoundComponent
  }

];
