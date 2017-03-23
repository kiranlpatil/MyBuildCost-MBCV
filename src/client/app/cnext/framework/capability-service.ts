import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MyCapabilityService {

  // Observable string sources
  private _showCapabilitySource = new Subject<Array>();

  // Observable string streams
  showTest$ = this._showCapabilitySource.asObservable();

  // Service message commands
  change(value: Array) {
    this._showCapabilitySource.next(value);
  }


}
