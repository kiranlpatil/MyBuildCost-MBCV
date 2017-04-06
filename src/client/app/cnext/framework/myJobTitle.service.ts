import {  Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class MYJobTitleService {

  // Observable string sources
   _showJobTitle = new Subject<string>();

  // Observable string streams
  showTestTitle$ = this._showJobTitle.asObservable();

  // Service message commands
  change(value: string) {
    this._showJobTitle.next(value);
  }


}
