import {   Injectable   } from '@angular/core';
import {  Http,Headers, RequestOptions  } from '@angular/http';
import {  Observable  } from 'rxjs/Observable';
import { BaseService } from '../../../framework/shared/httpservices/base.service';
import { API, LocalStorage } from '../../../framework/shared/constants';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';




@Injectable()
export class CapabilityListService extends BaseService {

  constructor(private http: Http) {
    super();
  }


  addCapability(capabilitylist:any):Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(capabilitylist);
    let url:string=API.CANDIDATE_PROFILE+'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCapability(industry:string,roles:Array<string>):Observable<any> {
    var url = API.INDUSTRY_LIST+'/'+industry+'/'+API.ROLE_LIST+'/'+API.CAPABILITY_LIST+'?roles='+JSON.stringify(roles);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
