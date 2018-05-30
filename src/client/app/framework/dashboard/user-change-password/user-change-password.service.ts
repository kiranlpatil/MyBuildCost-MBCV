import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ChangePassword } from '../../../user/models/change-password';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../shared/index';


@Injectable()
export class UserChangePasswordService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  changePassword(model: ChangePassword): Observable<ChangePassword> {
    var url = API.CHANGE_PASSWORD + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    var body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
