import {Route} from "@angular/router";
import {DashboardProfileComponent} from "./index";

export const DashboardProfileRoutes: Route[] = [
  {
      path: 'profile/:role',
    component: DashboardProfileComponent
  }
];
