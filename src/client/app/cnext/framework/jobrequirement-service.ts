import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class MyJobRequirementService {

  // Observable string sources
   _showCapabilitySource = new Subject<any>();

  // Observable string streams
   showTest$ = this._showCapabilitySource.asObservable();

  // Service message commands
  change(value: any) {
    this._showCapabilitySource.next(value);

  }
}
