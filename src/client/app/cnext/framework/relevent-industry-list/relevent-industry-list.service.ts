import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {API} from "../../../framework/shared/constants";
import {Http } from "@angular/http";
import {BaseService} from "../../../framework/shared/httpservices/base.service";

@Injectable()

export class ReleventIndustryListService extends BaseService {

  constructor(private http: Http) {
    super();
  }

    getReleventIndustries(data:string[],industryName:string): Observable<any> {
      var url = API.RElEVENT_INDUSTRIES + '?roles=' + JSON.stringify(data)+'&industryName=' + industryName;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
