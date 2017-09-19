import { Route } from '@angular/router';
import { RecruiterDashboardComponent } from './index';

export const RecruiterDashboard: Route[] = [
  {
    path: 'recruiterdashboard',
    component: RecruiterDashboardComponent
  },
  {
    path: 'recruiterdashboard/:id',
    component: RecruiterDashboardComponent
  },
  {
    path: 'recruiterdashboardedit/:jobid',
    component: RecruiterDashboardComponent
  }
];
