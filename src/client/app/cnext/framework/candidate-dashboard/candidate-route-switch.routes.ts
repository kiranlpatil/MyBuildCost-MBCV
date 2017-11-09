
import { Route } from '@angular/router';
import {CandidateRouteSwitchComponent} from "./candidate-route-switch.component";
import {CandidateDashboardComponent} from "./candidate-dashboard.component";
import {CandidateProfileComponent} from "../candidate-profile/candidate-profile.component";
import {ValuePortraitContainerComponent} from "../value-portrait/value-portrait-container.component";

export const CandidateRouteSwitch: Route[] = [
  {
    path: 'candidate',
    component: CandidateRouteSwitchComponent,
    children:[
      {path: '',redirectTo: 'dashboard',pathMatch: 'full'},
      {path: 'dashboard', component: CandidateDashboardComponent},
      {path: 'profile', component: CandidateProfileComponent},
      {path: 'value-portrait/:id', component: ValuePortraitContainerComponent}
    ]
  }
];
