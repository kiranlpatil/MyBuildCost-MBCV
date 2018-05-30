import { Injectable } from '@angular/core';
import { Http } from  '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ChangeMobile } from '../../models/change-mobile';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../shared/index';


@Injectable()
export class ChangeMobileService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  changeMobile(model: ChangeMobile): Observable<ChangeMobile> {
    var url = API.CHANGE_MOBILE + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    var body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);

  }

}
