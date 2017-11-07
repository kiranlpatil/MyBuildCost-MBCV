import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Headers, Http, RequestOptions} from "@angular/http";
import {API} from "../../../shared/constants";
import {BaseService} from "../../../shared/services/http/base.service";

@Injectable()

export class UserFeedbackComponentService extends BaseService{

  constructor(private http: Http) {
    super();
  }

  getFeedbackForCandidate():Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.FEEDBACK_QUESTIONS;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
