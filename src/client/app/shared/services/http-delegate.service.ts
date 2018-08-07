import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseService, ErrorInstance, LoaderService, Message, Messages } from '../index';
import { SessionStorageService } from './session.service';
import { AppSettings, SessionStorage } from '../constants';
import { MessageService } from './message.service';


@Injectable()
export class HttpDelegateService extends BaseService {

  constructor(protected http: Http, private messageService: MessageService, private loaderService: LoaderService) {
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
    let userId = SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    if(this.validate(url) || userId === AppSettings.SAMPLE_PROJECT_USER_ID) {
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});
      return this.http.put(url, JSON.stringify(body), options)
        .map(this.extractData)
        .catch(this.handleError);
    } else {
      var errorInstance = new ErrorInstance();
      errorInstance.err_msg = Messages.MSG_FOR_UPDATING_SAMPLE_PROJECT;
      errorInstance.err_code = 404;
      return Observable.throw(errorInstance);
    }
  }

  postAPI(url : string, body : any): Observable<any> {
    let userId = SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    if(this.validate(url) || userId === AppSettings.SAMPLE_PROJECT_USER_ID) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
    } else {
      var errorInstance = new ErrorInstance();
      errorInstance.err_msg = Messages.MSG_FOR_UPDATING_SAMPLE_PROJECT;
      errorInstance.err_code = 404;
      return Observable.throw(errorInstance);
    }
  }

  deleteAPI(url : string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.delete(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  xhrAPIRequest(url: any, body: any) {
    let userId = SessionStorageService.getSessionValue(SessionStorage.USER_ID);
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
      if(((url.substring(34,58)) !== AppSettings.SAMPLE_PROJECT_ID ) || userId === AppSettings.SAMPLE_PROJECT_USER_ID ) {
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + SessionStorageService.getSessionValue(SessionStorage.ACCESS_TOKEN));
        xhr.send(formData);
      } else {
        xhr.abort();
        this.loaderService.stop();
        let message = new Message();
        message.isError = true;
        message.error_msg = Messages.MSG_FOR_UPDATING_SAMPLE_PROJECT;
        message.error_code = 404;
        this.messageService.message(message);
      }
    });
  }

  validate(url: string) {
    let id =url.substring(8,32);
    if(id === AppSettings.SAMPLE_PROJECT_ID) {
      return false;
    } else {
      return true;
    }
  }

}
