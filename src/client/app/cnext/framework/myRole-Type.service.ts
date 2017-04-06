import {  Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class MyRoTypeTestService {

  // Observable string sources
   _showRoleTyprSource = new Subject<boolean>();

  // Observable string streams
   showTestRoleType$ = this._showRoleTyprSource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showRoleTyprSource.next(isAnswerTrue);
  }
}
