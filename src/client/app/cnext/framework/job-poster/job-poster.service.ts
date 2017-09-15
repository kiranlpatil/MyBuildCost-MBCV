import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/http/base.service";
import {API, LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {JobPosterModel} from "../../../user/models/jobPoster";

@Injectable()

export class JobPosterService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  postJob(jobDetail: JobPosterModel): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({'postedJobs': jobDetail});
    // /**//api/recruiter/:id/job"
    let url: string = API.RECRUITER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID) + '/job';
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  cloneJob(jobId: any,title:any): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({'postedJobs': jobId});
    let url: string = API.CLONE_JOB + '/' +jobId+ '/clone'+'?newJobTitle=' + title;
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
