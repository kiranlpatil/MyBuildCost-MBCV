import {  Injectable  } from '@angular/core';
import { Http } from '@angular/http';
import {  Observable  } from 'rxjs/Observable';
import { BaseService } from '../../../framework/shared/httpservices/base.service';
import { API } from '../../../framework/shared/constants';




@Injectable()
export class proficiencyDomainService extends BaseService {

  constructor(private http: Http) {
    super()
  }

  getProficiency():Observable<any> {
    var url = API.PROFICIENCYLIST;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getDomain():Observable<any> {
    var url = API.DOMAINLIST;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }




}
