/**
 * Created by techprimelab on 3/9/2017.
 */
import { Route } from '@angular/router';
import { CandidateSignUpComponent } from './candidate-sign-up.component';

export const CandidateSignUpRoutes: Route[] = [
  {
    path: '',
    component: CandidateSignUpComponent
  }/*,
  {
    path: 'applicant-signup/:id',
    component: CandidateSignUpComponent
  }*/
];
