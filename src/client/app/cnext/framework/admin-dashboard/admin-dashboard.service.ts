import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {MessageService} from "../../../framework/shared/message.service";
import {API, LocalStorage} from "../../../framework/shared/constants";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {CandidateDetail} from "../../../framework/registration/candidate/candidate";


@Injectable()
export class AdminDashboardService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getUserProfile(): Observable<any> {
    var url = API.USER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllUsers(): Observable<any> {
    var url = API.ALL_USER_PROFILE;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateProfile(model: CandidateDetail): Observable<CandidateDetail> {
    var url = API.USER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    let body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateUser(model: any): Observable<any> {
    var url = API.UPDATE_USER + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    let body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
