import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {API, LocalStorage, ValueConstant} from "../../../framework/shared/constants";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LoaderService} from "../../../framework/shared/loader/loader.service";

@Injectable()
export class CandidateDashboardService extends BaseService {//todo THIS CODE SHOULD FIT IN 30 LINE:SHRIKANT

  constructor(private http: Http,
              private loaderService: LoaderService) {
    super();
  }

  getJobList(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID) + '/jobProfile';
    this.loaderService.start();
    return this.http.get(url, options)
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
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID) + '/jobProfile/'
      + LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID) + '/' + ValueConstant.APPLIED_CANDIDATE + '/' + 'add';
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  blockJob(): Observable<any> {

    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({});
    // /**//api/recruiter/:id/job'
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID) + '/jobProfile/'
      + LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID) + '/' + ValueConstant.BLOCKED_CANDIDATE + '/' + 'add';
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  removeApplyJob(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({});
    // /**//api/recruiter/:id/job/api/candidate/590bfa262f1dde6216f2d5b3/jobProfile/590c62a33c503b824603cef0/applied/add'
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID) + '/jobProfile/'
      + LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID) + '/' + ValueConstant.APPLIED_CANDIDATE + '/' + 'remove';
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  removeBlockJob(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({});
    // /**//api/recruiter/:id/job'
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID) + '/jobProfile/'
      + LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID) + '/' + ValueConstant.BLOCKED_CANDIDATE + '/' + 'remove';
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
