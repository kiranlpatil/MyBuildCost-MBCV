
import {   Injectable  } from '@angular/core';
import {  Http,Headers, RequestOptions  } from '@angular/http';
import {  Observable  } from 'rxjs/Observable';
import {  BaseService  } from '../../../framework/shared/httpservices/base.service';
import {  API, LocalStorage  } from '../../../framework/shared/constants';
import {  LocalStorageService  } from '../../../framework/shared/localstorage.service';

@Injectable()
export class JobListerService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getJobList():Observable<any> {
    //let url:string=API.JOB_LIST+'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    let url:string=API.JOB_LIST+'/58eb799d12c8e79a69527ff0'
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
