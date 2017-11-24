import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/http/base.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { API, LocalStorage } from '../../../shared/constants';
import { LocalStorageService } from '../../../shared/services/localstorage.service';
import { QCardFilter } from '../model/q-card-filter';

@Injectable()

export class CandidateSearchService extends BaseService {

  constructor(private  http:Http) {
    super()
  }

  getCandidateByName(stringValue:string):Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    ///api/recruiter/:id/candidatesearch/:searchvalue
    let url:string = API.RECRUITER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID) + '/candidatesearch/' + stringValue;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getJobProfileMatching(candidateId:string, obj: QCardFilter):Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({obj});
    //var recruiterIdLocalStorageService.getLocalValue(LocalStorage.END_USER_ID)
    let url:string = 'jobs/candidate' + '/' + candidateId;
    return this.http.post(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
