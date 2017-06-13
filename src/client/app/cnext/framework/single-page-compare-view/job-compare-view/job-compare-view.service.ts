import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../../framework/shared/httpservices/base.service";
import {API} from "../../../../framework/shared/constants";

@Injectable()
export class JobCompareService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getCompareDetail(candidateId: string, recruiterId: string): Observable<any> {
    /*
     /api/recruiter/jobProfile/:jobId/matchresult/:candidateId

     */
    let url: string = API.RECRUITER_PROFILE + '/jobProfile/' + recruiterId + '/matchresult/' + candidateId;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
