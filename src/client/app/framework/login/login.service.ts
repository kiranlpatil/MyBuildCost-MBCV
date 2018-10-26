import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { API, BaseService, MessageService } from '../../shared/index';
import { GoogleToken } from '../../user/models/googletoken';
import { Login } from '../../user/models/login';


@Injectable()

export class LoginService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  userLogin(login: Login): Observable<Login> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var body = JSON.stringify(login);
    return this.http.post(API.LOGIN, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  setFBToken(fbToken: any): Observable<String> {
    let headers = new Headers({'Authorization': 'Bearer ' + fbToken});
    let options = new RequestOptions({headers: headers});
    return this.http.get(API.FB_LOGIN, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  setGoogleToken(model: GoogleToken): Observable<String> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var body = JSON.stringify(model);
    return this.http.post(API.GOOGLE_LOGIN, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  sendMailToAdmin(data:any): Observable<any> {
    var body = JSON.stringify(data);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(API.SEND_TO_ADMIN_MAIL, body, options)
      .map(this.extractDataWithoutToken)
      .catch(this.handleError);
  }

  getUserData(): Observable<any> {
    var url = API.USER_DATA;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  userTrack(data: any): Observable<Login> {
    var body = JSON.stringify(data);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('usage/track',body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
