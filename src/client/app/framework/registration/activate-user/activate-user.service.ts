import {Injectable} from "@angular/core";
import {Headers,Http,RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {API, BaseService, LocalStorage, LocalStorageService, MessageService} from "../../shared/index";


@Injectable()
export class ActiveUserService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  activeUser(): Observable<any> {
      var url = API.VERIFY_CHANGED_EMAIL + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
      var body = {'isActivated': true}; //JSON.stringify();
      return this.http.put(url, body)
        .map(this.extractData)
        .catch(this.handleError);
    /*} else {

      var url = API.VERIFY_USER + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
      var newData = {'isActivated': true}; //JSON.stringify();
      return this.http.put(url, newData)
        .map(this.extractData)
        .catch(this.handleError);
    }*/
  }
}
