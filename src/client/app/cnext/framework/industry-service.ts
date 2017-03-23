import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MyIndustryService {

  // Observable string sources
  private _showIndustrySource = new Subject<String>();

  // Observable string streams
  showTest$ = this._showIndustrySource.asObservable();

  // Service message commands
  change(value: String) {
    this._showIndustrySource.next(value);
  }


}
