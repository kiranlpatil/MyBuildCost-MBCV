import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {API, BaseService, LocalStorage, LocalStorageService, MessageService} from "../../../shared/index";

@Injectable()

export class SettingsService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  chageTheme(userbody: string): Observable<any> {
    var url = API.CHANGE_THEME + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    let obj: any = {current_theme: ''};
    obj.current_theme = userbody;
    let body: any = JSON.stringify(obj);
    return this.http.put(url, body)
      .map(this.extractDataWithoutToken)
      .catch(this.handleError);
  }
}
