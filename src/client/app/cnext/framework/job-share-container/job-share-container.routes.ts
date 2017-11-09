import {Route} from '@angular/router';
import {JobShareContainerComponent} from './job-share-container.component';

export const JobShareContainerRoutes:Route[] = [
  {
    path: 'jobposting/:shortUrl',
    component: JobShareContainerComponent
  }
];


