import {  Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class myRoTypeTestService {

  // Observable string sources
  private _showRoleTyprSource = new Subject<boolean>();

  // Observable string streams
  showTestRoleType$ = this._showRoleTyprSource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showRoleTyprSource.next(isAnswerTrue);
  }
}
