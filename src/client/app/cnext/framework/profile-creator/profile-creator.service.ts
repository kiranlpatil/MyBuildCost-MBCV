
import {   Injectable  } from '@angular/core';
import {  Http,Headers, RequestOptions  } from '@angular/http';
import {  Observable  } from 'rxjs/Observable';
import {  BaseService  } from '../../../framework/shared/httpservices/base.service';
import {  API, LocalStorage  } from '../../../framework/shared/constants';
import {  LocalStorageService  } from '../../../framework/shared/localstorage.service';
import {Candidate} from "../model/candidate";

@Injectable()
export class ProfileCreatorService extends BaseService {

  constructor(private http: Http) {
    super();
  }
  addProfileDetail(profile:Candidate):Observable<Candidate> {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(profile);
    let url:string=API.CANDIDATE_PROFILE+'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCandidateDetails():Observable<any> {
    let url:string=API.CANDIDATE_PROFILE+'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getIndustries():Observable<any> {
    var url = API.INDUSTRY_LIST;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

//why it is here
  getRoles(industry:string):Observable<any> {
    var url = 'industry/'+industry+'/role';
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRoleTypes():Observable<any> {
    var url = API.ROLE_TYPE;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
