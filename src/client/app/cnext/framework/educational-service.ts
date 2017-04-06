import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class EducationalService {

  // Observable string sources
   _showEducationalSource = new Subject<boolean>();

  // Observable string streams
   showTest$ = this._showEducationalSource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showEducationalSource.next(isAnswerTrue);
  }
}
