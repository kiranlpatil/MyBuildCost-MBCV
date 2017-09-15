import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/http/base.service";
import {API, LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {Industry} from "../../../user/models/industry";

@Injectable()

export class IndustryListService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  addIndustryProfile(industryprofile: Industry): Observable<Industry> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({'industry': industryprofile});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getIndustries(): Observable<any> {
    var url = API.INDUSTRY_LIST;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getRoles(industry: string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = 'industry/' + industry + '/role';
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
