
import {    Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';


@Injectable()
export class JobPostComplexityService  {

  // Observable string sources
   _showJobComplexitySource = new Subject<any>();

  // Observable string streams
   showTestComplexity$ = this._showJobComplexitySource.asObservable();

  // Service message commands
  change(value:any) {
    this._showJobComplexitySource.next(value);
  }

}
