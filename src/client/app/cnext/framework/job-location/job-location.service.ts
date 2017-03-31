

import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import { Http } from '@angular/http';
import {API} from "../../../framework/shared/constants";


@Injectable()
export class JobLocationService extends BaseService {
  constructor(private http:Http) {
    super();
  }


  getAddress():Observable<any> {
    var url = API.ADDRESS;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }



}
