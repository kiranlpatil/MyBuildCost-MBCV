import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class ShowJobFilterService {

  // Observable string sources
  _showJobFilterSource = new Subject<boolean>();

  // Observable string streams
  showJobFilter$ = this._showJobFilterSource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showJobFilterSource.next(isAnswerTrue);
  }
}
