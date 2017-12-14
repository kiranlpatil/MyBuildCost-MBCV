import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/http/base.service";
import {API, SessionStorage} from "../../../shared/constants";
import {SessionStorageService} from "../../../shared/services/session.service";

@Injectable()
export class IndustryExperienceService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  addIndustryExperience(industryprofile: any): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({'interestedIndustries': industryprofile});
    let url: string = API.CANDIDATE_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getIndustries(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.INDUSTRY_LIST;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
