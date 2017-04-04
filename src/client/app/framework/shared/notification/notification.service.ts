import {   Injectable  } from '@angular/core';
import {  Observable  } from 'rxjs/Rx';
import {  Http   } from '@angular/http';
import {  API,BaseService,MessageService,LocalStorageService,LocalStorage  } from '../../shared/index';
import {  Notification  } from './notification';

@Injectable()
export class NotificationService extends BaseService {

  constructor(protected http:Http,protected messageService:MessageService) {
    super();
  }

  getNotification():Observable<Notification[]> {
    var url=API.NOTIFICATION + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
