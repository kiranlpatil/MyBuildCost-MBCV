import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { JobPosterModel } from '../../user/models/jobPoster';

@Injectable()
export class ShowQcardviewService {

  // Observable string sources
  _showJobQCardViewrSource = new Subject<JobPosterModel>();

  // Observable string streams
  showJobQCardView$ = this._showJobQCardViewrSource.asObservable();

  // Service message commands
  change(candidate: JobPosterModel) {
    this._showJobQCardViewrSource.next(candidate);
  }
}
