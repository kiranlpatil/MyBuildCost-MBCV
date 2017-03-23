import { Injectable } from '@angular/core';
import {Http,Headers, RequestOptions} from '@angular/http';
import {industryProfile} from './industry';
import { Observable } from 'rxjs/Observable';
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {API, LocalStorage} from "../../../framework/shared/constants";
import {Industry} from "../model/industry";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";




@Injectable()
export class IndustryService extends BaseService {

  constructor(private http: Http) {
    super()
  }


  addIndustryProfile(industryprofile:industryProfile):Observable<industryProfile>{debugger

    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(industryprofile);
    let url:string=API.CANDIDATE_PROFILE+'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getIndustries():Observable<Industry> {
    var url = API.INDUSTRY_LIST;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getRoles(industry:string):Observable<any> {
    var url = 'industry/'+industry+'/role';
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
