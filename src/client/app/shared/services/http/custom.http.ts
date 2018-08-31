import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ConnectionBackend, Http, Request, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { ErrorInstance, Message, Messages, MessageService } from './../../index';
import { LoaderService } from '../../loader/loaders.service';

@Injectable()
export class CustomHttp extends Http {
  someProperty: string = 'some string';

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions,
              private messageService: MessageService,
              private loaderService: LoaderService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<any> {
    return this.intercept(super.request(url, options));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.intercept(super.get(url, options));
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.intercept(super.post(url, body, options));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
    return this.intercept(super.put(url, body, options));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.intercept(super.delete(url, options));
  }

  intercept(observable: Observable<any>): Observable<Response> {
   // this.loaderService.start();
    return observable.do(() => console.log(''))
      .catch((err, source) => {

//        this.loaderService.stop();
        var message = new Message();
        message.isError = true;
        var errorInstance = new ErrorInstance();
        if (err.err_msg && err.err_code) {
          errorInstance.err_msg = err.err_msg;
          errorInstance.err_code = err.err_code;
          return Observable.throw(errorInstance);
        } else if (err.status) {
          if(err.status === 401) {
            errorInstance.err_code = err.status;
            errorInstance.err_msg = err.statusText;
          } else if (err.status === 403 || err.status === 400 ) {
            errorInstance.err_code = err.status;
            errorInstance.err_msg = JSON.parse(err._body).error.message;
          } else if (err.status === 404) {
            errorInstance.err_msg = Messages.MSG_ERROR_SERVER_ERROR;
            errorInstance.err_code = err.status;
          } else if (err.status === 0) {
            errorInstance.err_msg = Messages.MSG_ERROR_SOMETHING_WRONG;
            errorInstance.err_code = err.status;
          } else {
            errorInstance.err_msg = JSON.parse(err._body).message;
            errorInstance.err_code = err.status;
          }
          return Observable.throw(errorInstance);
        } else {
          errorInstance.err_msg = Messages.MSG_ERROR_SOMETHING_WRONG;
          errorInstance.err_code = err.err_code?err.err_code:500;
          return Observable.throw(errorInstance);
        }
      });
  }
}

