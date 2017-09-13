import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/httpservices/base.service";
import {Headers, Http, RequestOptions} from "@angular/http";
import {API, LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";

@Injectable()
export class ProfessionalDataService extends BaseService {
  constructor(private http: Http) {
    super();
  }

  addProfessionalData(professionaldata: any): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({'professionalDetails': professionaldata});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRealocationList(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.REALOCATION;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getEducationList(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.EDUCATION;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getExperienceList(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.EXPERIENCE;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCurrentSalaryList(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.CURRENTSALARY;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getNoticePeriodList(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.NOTICEPERIOD;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getIndustryExposureList(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.INDUSTRYEXPOSURE;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addCandidateProfessionalData(candidateproficiency: string[]): Observable<string[]> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({'proficiencies': candidateproficiency});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
