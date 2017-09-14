import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {API} from "../../../shared/constants";
import {Headers, Http, RequestOptions} from "@angular/http";
import {BaseService} from "../../../shared/services/httpservices/base.service";

@Injectable()

export class ReleventIndustryListService extends BaseService {

  constructor(private http: Http) {
    super();
  }

    getReleventIndustries(data:string[],industryName:string): Observable<any> {
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});
      var url = API.RElEVENT_INDUSTRIES + '?roles=' + JSON.stringify(data)+'&industryName=' + industryName;
      return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
