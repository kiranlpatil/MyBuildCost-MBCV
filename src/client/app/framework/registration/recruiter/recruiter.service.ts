/**
 * Created by techprimelab on 3/9/2017.
 */
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Recruiter} from "./recruiter";
import {API, BaseService} from "../../../shared/index";
import {Headers, Http, RequestOptions} from "@angular/http";

@Injectable()
export class RecruiterService extends BaseService {
  constructor(private http: Http) {
    super();
  }

  addRecruiter(recruiter: Recruiter): Observable<Recruiter> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify(recruiter);
    return this.http.post(API.RECRUITER_PROFILE, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
