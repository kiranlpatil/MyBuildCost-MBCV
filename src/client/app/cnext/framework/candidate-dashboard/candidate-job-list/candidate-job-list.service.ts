import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {BaseService} from "../../../../shared/services/http/base.service";
import {API, SessionStorage, ValueConstant} from "../../../../shared/constants";
import {SessionStorageService} from "../../../../shared/services/session.service";
import {QCardFilter} from "../../model/q-card-filter";

@Injectable()
export class CandidateJobListService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getAppliedJobList(obj:QCardFilter) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({obj});
    let url: string = API.CANDIDATE_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.END_USER_ID) + '/list/' + ValueConstant.APPLIED_CANDIDATE;
    return this.http.post(url,body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getBlockedJobList(obj:QCardFilter) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({obj});
    let url: string = API.CANDIDATE_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.END_USER_ID) +
      '/list/' + ValueConstant.BLOCKED_CANDIDATE;
    return this.http.post(url,body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
