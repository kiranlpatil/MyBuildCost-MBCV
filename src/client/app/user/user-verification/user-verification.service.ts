import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {API, BaseService, LocalStorage, LocalStorageService, MessageService} from "../../shared/index";
import {VerifyUser} from "../models/verify-user";


@Injectable()
export class UserVerificationService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  verifyUserByMail(user: VerifyUser): Observable<any> {
    LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_registration');
    var url = API.SEND_VERIFICATION_MAIL + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var body = JSON.stringify(user);
    return this.http.post(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  verifyUserByMobile(user: VerifyUser): Observable<any> {
    var url = API.GENERATE_OTP + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var body = JSON.stringify(user);
    return this.http.post(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
