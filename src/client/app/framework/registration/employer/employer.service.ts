/**
 * Created by techprimelab on 3/9/2017.
 */
import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Employer } from './employer';
import { BaseService, API } from '../../shared/index';
import { Http,Headers, RequestOptions } from '@angular/http';

@Injectable()
export class EmployerService extends BaseService {
  constructor(private http:Http) {
    super();
  }

  addEmployer(employer:Employer):Observable<Employer> {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(employer);
    return this.http.post(API.USER_PROFILE, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
