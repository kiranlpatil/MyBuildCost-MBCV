import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { API, BaseService, LocalStorage, LocalStorageService, MessageService } from '../../shared/index';
import { VerifyOtp } from '../models/verify-otp';


@Injectable()
export class OtpVerificationService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  verifyPhone(user: VerifyOtp,userId:any): Observable<any> {
    var url = API.VERIFY_OTP + '/' + userId;
    var body = JSON.stringify(user);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  resendVerificationCode(userId:any,mobileNumber:any) {
    var url = API.GENERATE_OTP + '/' + userId;
    var body = {'mobile_number': mobileNumber};
    return this.http.post(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  resendChangeMobileVerificationCode(data:any) {
    var url = API.CHANGE_MOBILE + '/' + data.id;
    var body = {'new_mobile_number': data.new_mobile_number};
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  changeMobile(user: VerifyOtp,userid:any): Observable<any> {
    var url = API.VERIFY_MOBILE + '/' + userid;
    var body = JSON.stringify(user);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
