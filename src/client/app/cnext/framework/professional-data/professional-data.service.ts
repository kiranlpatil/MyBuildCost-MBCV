

import {   Injectable  } from '@angular/core';
import {  Observable  } from 'rxjs/Observable';
import { BaseService } from '../../../framework/shared/httpservices/base.service';
import {  Http,Headers, RequestOptions  } from '@angular/http';
import { ProfessionalData } from '../model/professional-data';
import { API, LocalStorage } from '../../../framework/shared/constants';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';

@Injectable()
export class ProfessionalDataService extends BaseService {
  constructor(private http:Http) {
    super();
  }

  addProfessionalData(professionaldata:any):Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({"professionalDetails":professionaldata});
    let url:string=API.CANDIDATE_PROFILE+'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRealocationList():Observable<any> {
    var url = API.REALOCATION;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getEducationList():Observable<any> {
    var url = API.EDUCATION;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getExperienceList():Observable<any> {
    var url = API.EXPERIENCE;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getCurrentSalaryList():Observable<any> {
    var url = API.CURRENTSALARY;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getNoticePeriodList():Observable<any> {
    var url = API.NOTICEPERIOD;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
  addCandidateProfessionalData(candidateproficiency:string[]):Observable<string[]>{
    let headers=new Headers({'Content-Type':'application/json'});
    let options=new RequestOptions({headers:headers});
    let body=JSON.stringify({"proficiencies":candidateproficiency})
    let url:string=API.CANDIDATE_PROFILE+'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
