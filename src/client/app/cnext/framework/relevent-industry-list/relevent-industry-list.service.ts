import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {API, LocalStorage} from "../../../framework/shared/constants";
import {Http, RequestOptions,Headers,URLSearchParams} from "@angular/http";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";

@Injectable()

export class ReleventIndustryListService extends BaseService {

  constructor(private http: Http) {
    super();
  }

    getReleventIndustries(data:string[],industryName:string): Observable<any> { debugger
      var url = API.RElEVENT_INDUSTRIES + '?roles=' + JSON.stringify(data)+'&industryName=' + industryName;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /*updateSelectedReleventIndustries(data:string[]): Observable<String> {
    var body = JSON.stringify(data);
    var url = API.RElEVENT_INDUSTRIES + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.post(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }*/
}
