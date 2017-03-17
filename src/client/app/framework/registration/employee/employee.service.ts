/**
 * Created by techprimelab on 3/9/2017.
 */
import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Employee } from './employee';
import { BaseService, API } from '../../shared/index';
import { Http,Headers, RequestOptions } from '@angular/http';

@Injectable()
export class EmployeeService extends BaseService {
  constructor(private http:Http) {
    super();
  }

  addEmployee(employee:Employee):Observable<Employee> {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(employee);
    return this.http.post(API.CANDIDATE_PROFILE, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
