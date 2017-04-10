import {   Injectable  } from '@angular/core';
import {  Http,Headers, RequestOptions  } from '@angular/http';
import {  Observable  } from 'rxjs/Observable';
import {  BaseService  } from '../../../framework/shared/httpservices/base.service';
import {  API, LocalStorage  } from '../../../framework/shared/constants';
import {  LocalStorageService  } from '../../../framework/shared/localstorage.service';
import {Industry} from "../model/industry";
import {JobPosterModel} from "../model/jobPoster";

@Injectable()

export class JobPosterService extends BaseService {

  constructor(private http: Http) {
    super();
  }
  postJob(jobDetail:JobPosterModel):Observable<JobPosterModel> {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({"postedJobs":jobDetail});
   // /**//api/recruiter/:id/job"
    let url:string=API.RECRUITER_PROFILE+'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID)+'/job';
    return this.http.put(url, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }



}
