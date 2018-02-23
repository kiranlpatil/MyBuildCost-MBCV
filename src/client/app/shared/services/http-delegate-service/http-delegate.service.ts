import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../../shared/index';


@Injectable()
export class HttpDelegateService extends BaseService {

  constructor(protected http: Http) {
    super();
  }

  getAPI(url : string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  putAPI(url : string, body : any): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.put(url, JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postAPI(url : string, body : any): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteAPI(url : string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.delete(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
