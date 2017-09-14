import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ChangePassword} from "./changepassword";
import {API, BaseService, LocalStorage, LocalStorageService, MessageService} from "../../../shared/index";


@Injectable()
export class ChangePasswordService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  changePassword(model: ChangePassword): Observable<ChangePassword> {
    var url = API.CHANGE_PASSWORD + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
