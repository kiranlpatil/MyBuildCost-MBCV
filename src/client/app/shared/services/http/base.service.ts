import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SessionStorage, SessionStorageService } from '../../index';


export class BaseService {

  extractData(res: Response) {
    let body = res.json();
    if (body.hasOwnProperty('access_token')) {
      SessionStorageService.setSessionValue(SessionStorage.ACCESS_TOKEN, body.access_token);
      if (body.data._id && body.data._id !== undefined) {
        SessionStorageService.setSessionValue(SessionStorage.USER_ID, body.data._id);
      }
    }
    return body || {};
  }

  extractDataWithoutToken(res: Response) {
    let body = res.json();
    return body || {};
  }

  handleError(error: any) {
    return Observable.throw(error);
  }
}
