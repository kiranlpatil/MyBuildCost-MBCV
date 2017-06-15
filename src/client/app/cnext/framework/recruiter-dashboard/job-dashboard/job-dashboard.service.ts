import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { API } from '../../../../framework/shared/constants';
import { BaseService } from '../../../../framework/shared/httpservices/base.service';

@Injectable()

export class JobDashboardService extends BaseService {


  constructor(private http: Http) {
    super();
  }

  getPostedJobDetails(jobId: string): Observable<any> {
    let url: string = API.JOB_DETAILS + '/' + jobId;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSearchedcandidate(jobId: string) {
    var url = 'recruiter/jobProfile/' + jobId + '/candidates';
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSelectedListData(jobId: string, listName: string) {
    var url = 'recruiter/jobProfile/' + jobId + '/list/' + listName;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
