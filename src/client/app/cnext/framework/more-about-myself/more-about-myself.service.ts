import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Headers, Http, RequestOptions} from "@angular/http";
import {BaseService} from "../../../shared/services/http/base.service";
import {API, LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";

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
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
