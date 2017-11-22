import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Headers, Http, RequestOptions} from "@angular/http";
import {BaseService} from "../../shared/services/http/base.service";
import {UsageTracking} from "./model/usage-tracking";

@Injectable()

export class UsageTrackingService extends BaseService {


  constructor(private http: Http) {
    super();
  }


  addUsesTrackingData(usageTrackingData: UsageTracking): Observable<any> {
    let url = 'usageTracking';
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({usageTrackingData});
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
