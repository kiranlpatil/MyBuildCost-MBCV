import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../../framework/shared/httpservices/base.service";
import {API} from "../../../../framework/shared/constants";

@Injectable()
export class CandidateCompareService extends BaseService {

  constructor(private http: Http) {
    super();
  }


  getCompareDetail(candidateId: string, recruiterId: string): Observable<any> {
    /*
     /api/candidate/:candidateId/matchresult/:jobId
     */

    let url: string = API.CANDIDATE_PROFILE + '/' + candidateId + '/matchresult/' + recruiterId;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }


}
