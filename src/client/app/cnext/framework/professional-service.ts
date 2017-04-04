import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class ProfessionalService {

  // Observable string sources
  private _showProfessionalSource = new Subject<boolean>();

  // Observable string streams
  showTest$ = this._showProfessionalSource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showProfessionalSource.next(isAnswerTrue);
  }
}
