import { Route } from '@angular/router';

export const StartRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  }
];
