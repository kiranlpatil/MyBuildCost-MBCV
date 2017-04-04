import {    Injectable  } from '@angular/core';
import {  Observable  } from 'rxjs/Observable';
import {  Registration  } from './registration';
import {  BaseService, API  } from '../shared/index';
import {  Http,Headers, RequestOptions  } from '@angular/http';

@Injectable()
export class RegistrationService extends BaseService {
  constructor(private http:Http) {
    super();
  }

  addRegistration(registration:Registration):Observable<Registration> {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(registration);
    return this.http.post(API.CANDIDATE_PROFILE, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
