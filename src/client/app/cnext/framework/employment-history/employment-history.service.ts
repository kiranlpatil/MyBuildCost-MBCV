import {    Injectable  } from '@angular/core';
import {  Observable  } from 'rxjs/Observable';
import {  Http,Headers, RequestOptions  } from '@angular/http';
import { BaseService } from '../../../framework/shared/httpservices/base.service';
import { API } from '../../../framework/shared/constants';
import { EmployementHistory } from '../model/employment-history';

@Injectable()
export class EmploymentHistoryService extends BaseService {
  constructor(private http:Http) {
    super();
  }

  addEmploymentHistroy(employmenthistory:EmployementHistory[] ):Observable<EmployementHistory > {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(employmenthistory);
    return this.http.post(API.EMPLOYMENTHISTORY, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
