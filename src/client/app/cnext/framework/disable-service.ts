import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DisableTestService {

  // Observable string sources
   _showDisableTestSource = new Subject<boolean>();

  // Observable string streams
   showTestDisable$ = this._showDisableTestSource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showDisableTestSource.next(isAnswerTrue);
  }
}
