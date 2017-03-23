import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MyRoleService {

  // Observable string sources
  private _showRoleSource = new Subject<Array>();

  // Observable string streams
  showTest$ = this._showRoleSource.asObservable();

  // Service message commands
  change(value: Array) {
    this._showRoleSource.next(value);
  }


}
