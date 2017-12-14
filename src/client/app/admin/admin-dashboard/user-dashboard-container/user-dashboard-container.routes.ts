import { Route } from '@angular/router';
import {UserDashboardContainerComponent} from "./user-dashboard-container.component";

export const UserDashboardContainer: Route[] = [
  {
    path: 'usercontainer',
    component: UserDashboardContainerComponent
  }];
