import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProfileCompareService {

  // Observable string sources
  _onCompareAction = new Subject<any>();

  // Observable string streams
  _compareAction$ = this._onCompareAction.asObservable();

  // Service message commands
  change(data: any) {
    this._onCompareAction.next(data);
  }
}
