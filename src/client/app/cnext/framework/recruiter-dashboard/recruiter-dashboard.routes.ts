import { Route } from '@angular/router';
import { RecruiterDashboardComponent } from './index';
import {JobListerComponent} from "./job-lister/job-lister.component";
import {CandidateSearchComponent} from "../candidate-search/candidate-search.component";
import {JobPosterComponent} from "../job-poster/job-poster.component";
import {JobDashboardComponent} from "./job-dashboard/job-dashboard.component";

export const RecruiterDashboard: Route[] = [
  {
    path: 'recruiter',
    component: RecruiterDashboardComponent,
    children: [
      {path: '',redirectTo: 'dashboard',pathMatch: 'full'},
      {path: 'dashboard', component: JobListerComponent},
      {path: 'search/:id', component: CandidateSearchComponent},
      {path: 'search', component: CandidateSearchComponent},
      {path: 'jobpost/:jobId', component: JobPosterComponent},
      {path: 'jobpost', component: JobPosterComponent},
      {path: 'job/:jobId', component: JobDashboardComponent}
    ]
  }
];
