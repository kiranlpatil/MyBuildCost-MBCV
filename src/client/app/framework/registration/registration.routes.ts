import {Route} from "@angular/router";
import {RegistrationComponent} from "./index";
import {CandidateComponent} from "./candidate/candidate.component";
import {RecruiterComponent} from "./recruiter/recruiter.component";

export const RegistrationRoutes: Route[] = [
  {
    path: 'registration',
    component: RegistrationComponent
  }
];
