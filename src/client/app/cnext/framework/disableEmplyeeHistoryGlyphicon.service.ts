import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class DisableEmployeeHistoryGlyphiconService {

  // Observable string sources
  _showSource = new Subject<boolean>();

  // Observable string streams
  removeGlyphiconTest$ = this._showSource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showSource.next(isAnswerTrue);
  }
}
