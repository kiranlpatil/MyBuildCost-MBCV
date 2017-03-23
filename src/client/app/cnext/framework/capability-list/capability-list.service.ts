import { Injectable } from '@angular/core';
import {Http,Headers, RequestOptions} from '@angular/http';
import {industryProfile} from './industry';
import { Observable } from 'rxjs/Observable';
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {API} from "../../../framework/shared/constants";




@Injectable()
export class CapabilityListService extends BaseService {

  constructor(private http: Http) {
    super()
  }


  /*addIndustryProfile(industryprofile:industryProfile):Observable<industryProfile>{

    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(industryprofile);
    return this.http.post(API.INDUSTRY_PROFILE, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }*/

  getCapability(industry:string,roles:Array<any>):Observable<any> {debugger
    /*industry/IT/roles/capability?roles=*/
    var url = API.INDUSTRY_LIST+'/'+industry+'/'+API.ROLE_LIST+'/'+API.CAPABILITY_LIST+'?roles='+JSON.stringify(roles);
    console.log(url);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }


  /*getRoles(industry:string):Observable<any> {
    var url = 'industry/'+industry+'/role';
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }*/

}
