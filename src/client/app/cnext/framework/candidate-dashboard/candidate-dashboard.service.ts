import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {API, SessionStorage, ValueConstant} from "../../../shared/constants";
import {BaseService} from "../../../shared/services/http/base.service";
import {SessionStorageService} from "../../../shared/services/session.service";
import {LoaderService} from "../../../shared/loader/loaders.service";
import {QCardFilter} from "../model/q-card-filter";

@Injectable()
export class CandidateDashboardService extends BaseService {//todo THIS CODE SHOULD FIT IN 30 LINE:SHRIKANT

  constructor(private http: Http,
              private loaderService: LoaderService) {
    super();
  }

  getJobList(obj:QCardFilter): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({obj});
    let url: string = API.CANDIDATE_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.END_USER_ID) + '/jobProfile';
    this.loaderService.start();
    return this.http.post(url,body,options)
      .map(this.extractData)
      .catch(this.errorHandle);
  }

  errorHandle(error: any) {
    this.loaderService.stop();
    return Observable.throw(error);
  }


  applyJob(): Observable<any> {//todo USE THE CONSTANYS IN URL :SHRIKANT

    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({});
    // /**//api/recruiter/:id/job/api/candidate/590bfa262f1dde6216f2d5b3/jobProfile/590c62a33c503b824603cef0/applied/add'
    let url: string = API.CANDIDATE_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.END_USER_ID) + '/jobProfile/'
      + SessionStorageService.getSessionValue(SessionStorage.CURRENT_JOB_POSTED_ID) + '/' + ValueConstant.APPLIED_CANDIDATE + '/' + 'add';
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  blockJob(): Observable<any> {

    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({});
    // /**//api/recruiter/:id/job'
    let url: string = API.CANDIDATE_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.END_USER_ID) + '/jobProfile/'
      + SessionStorageService.getSessionValue(SessionStorage.CURRENT_JOB_POSTED_ID) + '/' + ValueConstant.BLOCKED_CANDIDATE + '/' + 'add';
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  removeApplyJob(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({});
    // /**//api/recruiter/:id/job/api/candidate/590bfa262f1dde6216f2d5b3/jobProfile/590c62a33c503b824603cef0/applied/add'
    let url: string = API.CANDIDATE_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.END_USER_ID) + '/jobProfile/'
      + SessionStorageService.getSessionValue(SessionStorage.CURRENT_JOB_POSTED_ID) + '/' + ValueConstant.APPLIED_CANDIDATE + '/' + 'remove';
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  removeBlockJob(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({});
    // /**//api/recruiter/:id/job'
    let url: string = API.CANDIDATE_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.END_USER_ID) + '/jobProfile/'
      + SessionStorageService.getSessionValue(SessionStorage.CURRENT_JOB_POSTED_ID) + '/' + ValueConstant.BLOCKED_CANDIDATE + '/' + 'remove';
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
