import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Headers, Http, RequestOptions} from "@angular/http";
import {BaseService} from "../../../shared/services/http/base.service";
import {API, SessionStorage} from "../../../shared/constants";
import {SessionStorageService} from "../../../shared/services/session.service";

@Injectable()
export class AboutCandidateService extends BaseService {
  constructor(private http: Http) {
    super();
  }

  /* addEmploymentHistroy(employmenthistory:EmployementHistory[] ):Observable<EmployementHistory > {
   let headers = new Headers({ 'Content-Type': 'application/json'});
   let options = new RequestOptions({ headers: headers });
   let body = JSON.stringify(employmenthistory);
   return this.http.post(API., body,options)
   .map(this.extractData)
   .catch(this.handleError);
   }*/

  addAboutCandidate(aboutCandiadte: string[]): Observable<string[]> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({'aboutMyself': aboutCandiadte});
    let url: string = API.CANDIDATE_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
