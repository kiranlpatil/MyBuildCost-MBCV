import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {API, LocalStorage} from "../../../framework/shared/constants";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";

@Injectable()
export class RecruiterDashboardService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getJobList(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = API.JOB_LIST + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPostedJobDetails(jobId: string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = API.JOB_DETAILS + '/' + jobId;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCandidatesOfLists(Id: string, listname: string): Observable<any> {
    let url: string = API.CANDIDATESFROMLISTS + '/' + Id + '/' + 'list' + '/' + listname;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
