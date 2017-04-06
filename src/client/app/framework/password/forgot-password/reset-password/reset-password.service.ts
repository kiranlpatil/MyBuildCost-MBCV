import {    Injectable  } from '@angular/core';
import {  Http  } from '@angular/http';
import {  Observable  } from 'rxjs/Observable';
import {  MessageService  } from '../../../shared/message.service';
import {  LocalStorageService  } from '../../../shared/localstorage.service';
import {  BaseService  } from '../../../shared/httpservices/base.service';
import {  LocalStorage,API  } from '../../../shared/index';
import {  ResetPassword  } from './reset-password';


@Injectable()
export class ResetPasswordService extends BaseService {

    constructor(protected http:Http,protected messageService:MessageService) {
        super();
    }

    newPassword (model:ResetPassword):Observable<any> {
        var url=API.RESET_PASSWORD +'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
        var body = JSON.stringify(model);
        return this.http.put(url,body)
            .map(this.extractDataWithoutToken)
            .catch(this.handleError);
    }
}
