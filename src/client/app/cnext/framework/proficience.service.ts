import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class ProficiencyService {

  // Observable string sources
   _showProfeciencySource = new Subject<boolean>();

  // Observable string streams
  showTest$ = this._showProfeciencySource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showProfeciencySource.next(isAnswerTrue);
  }
}
