import {   Injectable  } from '@angular/core';
import {  Http  } from '@angular/http';
import {  Observable  } from 'rxjs/Observable';
import {  BaseService, LocalStorageService,LocalStorage,MessageService,API  } from '../../shared/index';
import {  VerifyUser  } from './verify_phone';


@Injectable()
export class VerifyPhoneService extends BaseService {

    constructor(protected http:Http,protected messageService:MessageService) {
        super();
    }

    verifyPhone (user:VerifyUser):Observable<any> {
        var url=API.VERIFY_OTP +'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
        var body = JSON.stringify(user);
        return this.http.put(url,body)
            .map(this.extractData)
            .catch(this.handleError);
    }

  resendVerificationCode () {
    var url=API.GENERATE_OTP +'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var mobile = LocalStorageService.getLocalValue(LocalStorage.MOBILE_NUMBER);
    var body = {'mobile_number': mobile };
    return this.http.post(url,body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  resendChangeMobileVerificationCode () {
    var url=API.CHANGE_MOBILE +'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var mobile = LocalStorageService.getLocalValue(LocalStorage.MOBILE_NUMBER);
    var body = {'new_mobile_number': mobile };
    return this.http.put(url,body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  changeMobile (user:VerifyUser):Observable<any> {
    var url=API.VERIFY_MOBILE +'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var body = JSON.stringify(user);
    return this.http.put(url,body)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
