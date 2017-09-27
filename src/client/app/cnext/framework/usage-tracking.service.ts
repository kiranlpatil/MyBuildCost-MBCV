import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseService } from '../../shared/services/http/base.service';
import { UsageActions } from '../../shared/constants';
import { UsageTracking } from './model/usage-tracking';

@Injectable()

export class UsageTrackingService extends BaseService {


  constructor(private http: Http) {
    super();
  }


  addUsesTrackingData(action: UsageActions, recruiterId?: string, jobProfileId?: string, candidateId?: string): Observable<any> {
    let url = 'usageTracking';
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let data: UsageTracking = new UsageTracking(action,recruiterId,jobProfileId,candidateId);
    let body = JSON.stringify({data});
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
