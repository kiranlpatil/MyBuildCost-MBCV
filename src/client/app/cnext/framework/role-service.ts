import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class MyRoleService {

  // Observable string sources
   _showRoleSource = new Subject<Array<string>>();

  // Observable string streams
  showTest$ = this._showRoleSource.asObservable();

  // Service message commands
  change(value: Array<string>) {
    this._showRoleSource.next(value);
  }


}
