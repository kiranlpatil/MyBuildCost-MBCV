import {Injectable} from "@angular/core";
import {BaseService} from "../../shared/services/http/base.service";
import {SessionStorage, API} from "../../shared/constants";
import {SessionStorageService} from "../../shared/services/session.service";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";

@Injectable()

export class GuidedTourService extends BaseService {
 constructor(private http: Http) {
   super();
 }

  updateProfileField(model:string[]):Observable<any> {
      var url = API.USER_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID) + '/' + 'fieldname' + '/' + 'guide_tour';
      let body = JSON.stringify(model);
      return this.http.put(url, body)
        .map(this.extractData)
        .catch(this.handleError);
    //console.log(' You break your flow. please logout yourself');
  }

}
