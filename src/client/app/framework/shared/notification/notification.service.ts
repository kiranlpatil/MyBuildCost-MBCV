import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Headers, Http, RequestOptions} from "@angular/http";
import {API, BaseService, LocalStorage, LocalStorageService, MessageService} from "../../../shared/index";
import {Notification} from "./notification";

@Injectable()
export class NotificationService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getNotification(): Observable<Notification[]> {
    var url = API.NOTIFICATION + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
