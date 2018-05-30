import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../../../shared/services/message.service';
import { SessionStorageService } from '../../../../shared/services/session.service';
import { BaseService } from '../../../../shared/services/http/base.service';
import { API, SessionStorage } from '../../../../shared/index';
import { ResetPassword } from '../../../../user/models/reset-password';


@Injectable()
export class ResetPasswordService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  newPassword(model: ResetPassword): Observable<any> {
    var url = API.RESET_PASSWORD + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    var body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractDataWithoutToken)
      .catch(this.handleError);
  }
}
