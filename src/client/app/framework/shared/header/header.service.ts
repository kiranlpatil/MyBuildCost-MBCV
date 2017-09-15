import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/http/base.service";
import {API, LocalStorage} from "../../../shared/constants";
import {MessageService} from "../../../shared/services/message.service";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {UserProfile} from "../../../user/models/user";


@Injectable()
export class HeaderService extends BaseService {


  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getUserProfile(): Observable<UserProfile> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.USER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
