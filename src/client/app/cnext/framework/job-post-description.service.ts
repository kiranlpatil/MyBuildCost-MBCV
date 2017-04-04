import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class JonPostDescriptionService {

  // Observable string sources
  private _showTesDescriptionSource = new Subject<any>();

  // Observable string streams
  showTestJobPostDesc$ = this._showTesDescriptionSource.asObservable();

  // Service message commands
  change(desc: any) {
    this._showTesDescriptionSource.next(desc);
  }
}
