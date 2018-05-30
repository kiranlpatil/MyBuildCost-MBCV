import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../shared/index';


@Injectable()
export class ActiveUserService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  activeUser(): Observable<any> {
      var url = API.VERIFY_CHANGED_EMAIL + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
      var body = {'isActivated': true};
      return this.http.put(url, body)
        .map(this.extractData)
        .catch(this.handleError);
  }
}
