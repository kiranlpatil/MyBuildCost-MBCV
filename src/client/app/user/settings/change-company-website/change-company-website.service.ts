import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {API, BaseService, LocalStorage, LocalStorageService} from "../../../shared/index";
import {ChangeCompanyWebsite} from "../../models/change-company-website";


@Injectable()
export class ChangeCompanyWebsiteService extends BaseService {

  constructor(protected http: Http) {
    super();
  }

  changeCompanyWebsite(model:ChangeCompanyWebsite): Observable<ChangeCompanyWebsite> {
    var url = API.CHANGE_COMPANY_WEBSITE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);

  }
}
