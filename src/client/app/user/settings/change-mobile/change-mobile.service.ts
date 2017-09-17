import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ChangeMobile} from "../../models/changemobile";
import {API, BaseService, LocalStorage, LocalStorageService, MessageService} from "../../../shared/index";


@Injectable()
export class ChangeMobileService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  changeMobile(model: ChangeMobile): Observable<ChangeMobile> {
    var url = API.CHANGE_MOBILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);

  }

}
