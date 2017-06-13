import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../httpservices/base.service";
import {API, LocalStorage} from "../constants";
import {MessageService} from "../message.service";
import {LocalStorageService} from "../localstorage.service";
import {UserProfile} from "../../dashboard/user";


@Injectable()
export class HeaderService extends BaseService {


  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getUserProfile(): Observable<UserProfile> {
    var url = API.USER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
