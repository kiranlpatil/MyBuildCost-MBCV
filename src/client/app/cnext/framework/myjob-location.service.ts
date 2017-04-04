

import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';
import { JobLocation } from './model/job-location';

@Injectable()
export class myJobLocationService  {

  // Observable string sources
  private _showJobLocationSource = new Subject<JobLocation>();

  // Observable string streams
  showTestLocation$ = this._showJobLocationSource.asObservable();

  // Service message commands
  change(value:JobLocation) {
    this._showJobLocationSource.next(value);
  }





}
