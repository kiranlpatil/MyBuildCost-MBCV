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

    getReleventIndustries(data:string[]): Observable<any> { debugger
      var url = API.RElEVENT_INDUSTRIES + '?roles=' + JSON.stringify(data);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateSelectedReleventIndustries(data:string[]): Observable<String> {
    var body = JSON.stringify(data);
    return this.http.post(API.GOOGLE_LOGIN, body)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
