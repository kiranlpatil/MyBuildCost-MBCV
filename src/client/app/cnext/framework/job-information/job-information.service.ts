import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {JobInformation} from "../model/job-information";

@Injectable()
export class MyJobInformationService {

  // Observable string sources
  private _showJobinformationSource = new Subject<JobInformation>();

  // Observable string streams
  showTestInformation$ = this._showJobinformationSource.asObservable();

  // Service message commands
  change(value: JobInformation) {
    this._showJobinformationSource.next(value);
  }


}
