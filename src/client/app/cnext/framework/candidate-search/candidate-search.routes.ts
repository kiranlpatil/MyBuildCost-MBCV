import {Route} from "@angular/router";
import {CandidateSearchComponent} from "./candidate-search.component";

export const CandidateSearchRoutes:Route[] = [
  {
    path: 'applicant_search',
    component: CandidateSearchComponent
  },
  {
    path: 'applicant_search/:id',
    component: CandidateSearchComponent
  }
];
