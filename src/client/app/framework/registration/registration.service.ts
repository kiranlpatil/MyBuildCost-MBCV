import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Registration} from "./registration";
import {API, BaseService} from "../shared/index";
import {Headers, Http, RequestOptions} from "@angular/http";

@Injectable()
export class RegistrationService extends BaseService {
  constructor(private http: Http) {
    super();
  }

  addRegistration(registration: Registration): Observable<Registration> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify(registration);
    return this.http.post(API.CANDIDATE_PROFILE, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
