import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/http/base.service";
import {Headers, Http, RequestOptions} from "@angular/http";
import {API} from "../../../shared/constants";


@Injectable()
export class BasicJobInformationService extends BaseService {
  constructor(private http: Http) {
    super();
  }


  getAddress(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.ADDRESS;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


}
