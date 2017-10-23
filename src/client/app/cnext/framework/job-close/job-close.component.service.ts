import {Injectable} from "@angular/core";
import {Headers,Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/http/base.service";

@Injectable()

export class JobCloseComponentService extends BaseService {

  constructor(private http:Http) {
    super();
  }

  getReasonsForClosingJob():Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = 'closeJob';
    return this.http.get(url,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
