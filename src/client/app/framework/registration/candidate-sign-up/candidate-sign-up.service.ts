import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CandidateDetail } from '../../../user/models/candidate-details';
import { API, BaseService } from '../../../shared/index';
import { Headers, Http, RequestOptions } from '@angular/http';

@Injectable()
export class CandidateSignUpService extends BaseService {
  constructor(private http: Http) {
    super();
  }

  addCandidate(candidate: CandidateDetail): Observable<CandidateDetail> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify(candidate);
    return this.http.post(API.CANDIDATE_PROFILE, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  sendMailToRecruiter(data: any): Observable<any> {
    var url = API.SEND_NOTIFICATION_TO_RECRUITER ;
    var body = JSON.stringify(data);
    return this.http.post(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
