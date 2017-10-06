import { Injectable } from '@angular/core';
import {Headers,Http, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../../shared/services/http/base.service';
import {Share} from "../model/share";
import {API} from "../../../shared/constants";

@Injectable()

export class JobShareContainerService extends BaseService {

  constructor(private http:Http) {
    super();
  }

  getActualJobShareUrl(shortUrl:string):Observable<any> {
    var url = 'share' + '/' + shortUrl;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
  updateUrl(shareurl: string): Observable<any>{
  let headers = new Headers({'Content-Type': 'application/json'});
  let options = new RequestOptions({headers: headers});
  let url: string = 'share' + '/' + shareurl ;
  return this.http.put(url, options)
    .map(this.extractData)
    .catch(this.handleError);
}
}
