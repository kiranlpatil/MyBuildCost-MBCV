import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ForgotPassword } from '../../../user/models/forgot-password';
import { API, BaseService } from '../../../shared/index';
import { Headers, Http, RequestOptions } from '@angular/http';

@Injectable()
export class ForgotPasswordService extends BaseService {
  constructor(private http: Http) {
    super();
  }

  forgotPassword(email: ForgotPassword): Observable<ForgotPassword> {
    var body = JSON.stringify(email);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(API.FORGOT_PASSWORD, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
