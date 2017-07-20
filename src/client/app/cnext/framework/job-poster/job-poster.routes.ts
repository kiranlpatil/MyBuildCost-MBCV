import {Route} from "@angular/router";
import {JobPosterComponent} from "./job-poster.component";

export const JobPosterRoutes: Route[] = [{
  path: 'jobpost/:jobId',
  component: JobPosterComponent
}];

