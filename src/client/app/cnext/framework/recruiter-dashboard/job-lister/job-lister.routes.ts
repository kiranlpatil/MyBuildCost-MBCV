import { Route } from '@angular/router';
import {JobListerComponent} from "./job-lister.component";

export const JobLister: Route[] = [
  {
    path: 'joblister',
    component: JobListerComponent
  }
];
