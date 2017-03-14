import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {example} from './industry';
import {BaseService} from '../../../framework/shared/httpservices/base.service';




@Injectable()
export class IndustryService extends BaseService {

  constructor(private http: Http) {
    super()
  }

   public getIndustries(roleName : string) {
     return this.http.get(roleName)
       .map(this.extractData)
       .catch(this.handleError);
  }
}
