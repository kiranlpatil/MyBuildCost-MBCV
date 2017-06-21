import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RedirectRecruiterDashboardService {

  // Observable string sources
  _showRedirectSource = new Subject<boolean>();

  // Observable string streams
  showTest$ = this._showRedirectSource.asObservable();

  // Service message commands
  change(isShow: boolean) {
    this._showRedirectSource.next(isShow);
  }


}
