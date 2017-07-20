import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {BaseService} from "../../../../framework/shared/httpservices/base.service";
import {API, LocalStorage, ValueConstant} from "../../../../framework/shared/constants";
import {LocalStorageService} from "../../../../framework/shared/localstorage.service";

@Injectable()
export class CandidateJobListService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getAppliedJobList() {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID) + '/list/' + ValueConstant.APPLIED_CANDIDATE;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getBlockedJobList() {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID) +
      '/list/' + ValueConstant.BLOCKED_CANDIDATE;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
