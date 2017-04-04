

import {    Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';


@Injectable()
export class myJobPostcapabilityService  {

  // Observable string sources
  private _showJobCpabilitiesSource = new Subject<any>();

  // Observable string streams
  showTestCapability$ = this._showJobCpabilitiesSource.asObservable();

  // Service message commands
  change(value:any) {
    this._showJobCpabilitiesSource.next(value);
  }

}
