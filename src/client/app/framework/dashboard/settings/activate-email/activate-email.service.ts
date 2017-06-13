import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {API, BaseService, LocalStorage, LocalStorageService, MessageService} from "../../../shared/index";


@Injectable()
export class ActiveEmailService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  activeEmail(): Observable<any> {
    var url = API.VERIFY_EMAIL + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
}
