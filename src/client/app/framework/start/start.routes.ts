import {  Route  } from '@angular/router';

export const StartRoutes:Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: '/landing' //  'landing 'or'login' companydetails
  }
];
