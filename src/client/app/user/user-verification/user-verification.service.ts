import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../shared/index';
import { VerifyUser } from '../models/verify-user';


@Injectable()
export class UserVerificationService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  verifyUserByMail(user: VerifyUser): Observable<any> {
    SessionStorageService.setSessionValue(SessionStorage.CHANGE_MAIL_VALUE, 'from_registration');
    var url = API.SEND_VERIFICATION_MAIL + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    var body = JSON.stringify(user);
    return this.http.post(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  verifyUserByMobile(user: VerifyUser): Observable<any> {
    var url = API.GENERATE_OTP + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    var body = JSON.stringify(user);
    return this.http.post(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
