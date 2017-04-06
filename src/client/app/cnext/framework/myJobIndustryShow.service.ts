import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class JobIndustryShowService {

  // Observable string sources
  _showIndustry = new Subject<boolean>();

  // Observable string streams
  showIndustryt$ = this._showIndustry.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showIndustry.next(isAnswerTrue);
  }
}
