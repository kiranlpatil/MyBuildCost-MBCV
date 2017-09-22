import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Headers, Http, RequestOptions} from "@angular/http";
import {API, UsageActions} from "../../../../shared/constants";
import {BaseService} from "../../../../shared/services/http/base.service";
import {LoaderService} from "../../../../shared/loader/loaders.service";
import {UsageTracking} from "../../model/usage-tracking";

@Injectable()

export class JobDashboardService extends BaseService {


  constructor(private http: Http,
              private loaderService: LoaderService) {
    super();
  }

  getPostedJobDetails(jobId: string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = API.JOB_DETAILS + '/' + jobId;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSearchedcandidate(jobId: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = 'recruiter/jobProfile/' + jobId + '/candidates';
    this.loaderService.start();
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.errorHandle);
  }

  errorHandle(error: any) {
    this.loaderService.stop();
    return Observable.throw(error);
  }

  getSelectedListData(jobId: string, listName: string) {
    var url = 'recruiter/jobProfile/' + jobId + '/list/' + listName;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addUsesTrackingData(action: UsageActions, recruiterId?: string, jobProfileId?: string, candidateId?: string): Observable<any> {
    let url = 'usageTracking';
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let data: UsageTracking = new UsageTracking(action,recruiterId,jobProfileId,candidateId);
    let body = JSON.stringify({data});
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
