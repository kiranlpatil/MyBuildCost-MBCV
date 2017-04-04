import {  Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';
import { JobRequirement } from '../model/job-requirement';

@Injectable()
export class JobRequirementService {

  // Observable string sources
  private _showJobRequirementSource = new Subject<JobRequirement>();

  // Observable string streams
  showTestRequirement$ = this._showJobRequirementSource.asObservable();

  // Service message commands
  change(value: JobRequirement) {
    this._showJobRequirementSource.next(value);
  }


}
