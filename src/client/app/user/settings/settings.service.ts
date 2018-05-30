import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {API, BaseService, SessionStorage, SessionStorageService, MessageService} from "../../shared/index";

@Injectable()

export class SettingsService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  changeTheme(userbody: string): Observable<any> {
    var url = API.CHANGE_THEME + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    let obj: any = {current_theme: ''};
    obj.current_theme = userbody;
    let body: any = JSON.stringify(obj);
    return this.http.put(url, body)
      .map(this.extractDataWithoutToken)
      .catch(this.handleError);
  }
}
