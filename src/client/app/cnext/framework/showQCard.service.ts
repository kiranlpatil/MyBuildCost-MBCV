import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class ShowQcardviewService {

  // Observable string sources
  _showJobQCardViewrSource = new Subject<boolean>();

  // Observable string streams
  showJobQCardView$ = this._showJobQCardViewrSource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showJobQCardViewrSource.next(isAnswerTrue);
  }
}
