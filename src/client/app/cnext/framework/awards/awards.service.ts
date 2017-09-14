import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseService } from '../../../shared/services/httpservices/base.service';
import { API, LocalStorage } from '../../../shared/constants';
import { LocalStorageService } from '../../../shared/services/localstorage.service';
import { Award } from '../model/award';

@Injectable()
export class CandidateAwardService extends BaseService {
  constructor(private http: Http) {
    super();
  }


  addCandidateAward(candidateAward: Award[]): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({'awards': candidateAward});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
