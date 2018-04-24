import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../index';
import { SessionStorageService } from './session.service';
import { SessionStorage } from '../constants';


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

  xhrAPIRequest(url: any, body: any) {
    let files = body;
    return new Promise((resolve: any, reject: any) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      formData.append('file', files.fileName[0], files.fileName[0].name);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + SessionStorageService.getSessionValue(SessionStorage.ACCESS_TOKEN));
      xhr.send(formData);
    });
  }

}
