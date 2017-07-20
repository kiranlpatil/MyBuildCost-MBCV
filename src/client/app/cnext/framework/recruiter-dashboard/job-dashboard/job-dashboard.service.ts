import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Headers, Http, RequestOptions} from "@angular/http";
import {API} from "../../../../framework/shared/constants";
import {BaseService} from "../../../../framework/shared/httpservices/base.service";
import {LoaderService} from "../../../../framework/shared/loader/loader.service";

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

}
