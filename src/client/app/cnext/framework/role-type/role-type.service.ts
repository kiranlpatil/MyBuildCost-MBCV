import {  Injectable  } from '@angular/core';
import { Http } from '@angular/http';
import {  Observable  } from 'rxjs/Observable';
import { BaseService } from "../../../framework/shared/httpservices/base.service";
import { API } from "../../../framework/shared/constants";




@Injectable()
export class RoleTypeService extends BaseService {

  constructor(private http: Http) {
    super()
  }




  getRoleTypes():Observable<any> {
    var url = API.ROLE_TYPE;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }




}
