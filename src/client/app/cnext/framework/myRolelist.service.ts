import {  Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class myRoleListTestService {

  // Observable string sources
  private _showRoleTestSource = new Subject<boolean>();

  // Observable string streams
  showTestRolelist$ = this._showRoleTestSource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showRoleTestSource.next(isAnswerTrue);
  }
}
