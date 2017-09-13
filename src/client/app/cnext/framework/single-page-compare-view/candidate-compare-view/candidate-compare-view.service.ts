import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../../shared/services/httpservices/base.service";
import {API} from "../../../../shared/constants";

@Injectable()
export class CandidateCompareService extends BaseService {

  constructor(private http: Http) {
    super();
  }


  getCompareDetail(candidateId: string, recruiterId: string): Observable<any> {
    /*
     /api/candidate/:candidateId/matchresult/:jobId
     */
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = API.CANDIDATE_PROFILE + '/' + candidateId + '/matchresult/' + recruiterId;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
