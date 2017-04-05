import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AwardService {

  // Observable string sources
   _showAwardSource = new Subject<boolean>();

  // Observable string streams
  showTest$ = this._showAwardSource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showAwardSource.next(isAnswerTrue);
  }
}
