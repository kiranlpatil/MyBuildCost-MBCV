import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class MyCapabilityService {

  // Observable string sources
   _showCapabilitySource = new Subject<Array<string>>();

  // Observable string streams
   showTest$ = this._showCapabilitySource.asObservable();

  // Service message commands
  change(value: Array<string>) {
    this._showCapabilitySource.next(value);
  }


}
