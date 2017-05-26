
import {Route} from "@angular/router";
import {JobDashboardComponent} from "./job-dashboard.component";

export const JobDashboardRoutes: Route[] = [{
  path:'jobdashboard/:jobId',
  component:JobDashboardComponent
}]

