
import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';


@Injectable()
export class JobPostProficiencyService  {

  // Observable string sources
   _showJobPostProficiencySource = new Subject<any>();

  // Observable string streams
   showTestJobPostProficiency$ = this._showJobPostProficiencySource.asObservable();

  // Service message commands
  change(value:any) {
    this._showJobPostProficiencySource.next(value);
  }

}
