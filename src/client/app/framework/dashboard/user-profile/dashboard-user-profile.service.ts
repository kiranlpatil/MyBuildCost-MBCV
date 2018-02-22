import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../shared/index';
import { UserProfile } from '../../../user/models/user';


@Injectable()
export class DashboardUserProfileService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getUserProfile(): Observable<any> {
    var url = API.USER_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateProfile(model: UserProfile): Observable<UserProfile> {
    var url = API.USER_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    let body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
