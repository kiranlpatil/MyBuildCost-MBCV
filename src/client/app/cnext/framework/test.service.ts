import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class TestService {

  // Observable string sources
  private _showTestSource = new Subject<boolean>();

  // Observable string streams
  showTest$ = this._showTestSource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showTestSource.next(isAnswerTrue);
  }
}
