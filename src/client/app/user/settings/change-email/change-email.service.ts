import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ChangeEmail } from '../../models/change-email';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../shared/index';


@Injectable()
export class ChangeEmailService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  changeEmail(model: ChangeEmail): Observable<ChangeEmail> {
    var url = API.CHANGE_EMAIL + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    var body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);

  }
}
