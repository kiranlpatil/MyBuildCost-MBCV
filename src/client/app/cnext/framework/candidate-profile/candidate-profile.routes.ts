import { Route } from '@angular/router';
import { CandidateProfileComponent } from './index';

export const ProfileCreator: Route[] = [
  {
    path: 'create_profile',
    component: CandidateProfileComponent
  }
];
