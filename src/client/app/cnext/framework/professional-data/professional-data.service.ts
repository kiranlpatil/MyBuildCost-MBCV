/*
import { Injectable } from '@angular/core';
import {Http,Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {API} from "../../../framework/shared/constants";
import {ProfessionalData} from "../model/professional-data";





@Injectable()
export class ProfessionalDataService extends BaseService {

  constructor(private http: Http) {
    super()
  }



  addProfessionalData(professionaldata:ProfessionalData):Observable<ProfessionalData>{debugger

    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(professionaldata);
    return this.http.post('professionaldata', body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
*/

import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import { Http,Headers, RequestOptions } from '@angular/http';
import {ProfessionalData} from "../model/professional-data";
import {API} from "../../../framework/shared/constants";

@Injectable()
export class ProfessionalDataService extends BaseService {
  constructor(private http:Http) {
    super();
  }

  addProfessionalData(professionaldata:ProfessionalData):Observable<ProfessionalData> {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(professionaldata);
    return this.http.post(API.PROFESSIONAL_DATA, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
