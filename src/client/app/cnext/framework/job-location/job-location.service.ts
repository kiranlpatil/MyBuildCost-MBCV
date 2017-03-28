

import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import { Http,Headers, RequestOptions } from '@angular/http';
import {ProfessionalData} from "../model/professional-data";
import {API, LocalStorage} from "../../../framework/shared/constants";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";

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
