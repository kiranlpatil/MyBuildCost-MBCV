import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseService } from '../../../../shared/services/httpservices/base.service';

@Injectable()
export class FilterService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getListForFilter() {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = 'filterlist';
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
