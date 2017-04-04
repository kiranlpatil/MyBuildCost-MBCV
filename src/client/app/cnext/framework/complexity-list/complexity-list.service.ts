import {   Injectable  } from '@angular/core';
import {  Http,Headers, RequestOptions } from '@angular/http';
import {  Observable  } from 'rxjs/Observable';
import { BaseService } from '../../../framework/shared/httpservices/base.service';
import { API } from '../../../framework/shared/constants';




@Injectable()
export class ComplexityListService extends BaseService {

  constructor(private http: Http) {
    super()
  }
  getComplexity(industry:string,roles:Array<any>,capabilities:Array<any>):Observable<any> {
    /*industry/IT/roles/capability?roles=*/
    var url = API.INDUSTRY_LIST+'/'+industry+'/'+API.ROLE_LIST+'/'+API.CAPABILITY_LIST+'/complexity?roles='+JSON.stringify(roles)+'&capability='+JSON.stringify(capabilities);
    console.log(url);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }


}
