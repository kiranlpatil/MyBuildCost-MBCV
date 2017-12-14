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

  getTourStatus(): Array<string> {
    var dataString = SessionStorageService.getSessionValue(SessionStorage.GUIDED_TOUR);
    return JSON.parse(dataString);
  }

  updateTourStatus(imgName:string,imgSatus:boolean): Array<string> {
    var dataString = SessionStorageService.getSessionValue(SessionStorage.GUIDED_TOUR);
    var dataArray:string[] = new Array(0);
    dataArray = JSON.parse(dataString);
    if (dataArray == null) {
      dataArray = new Array(0);
    }
    if(dataArray.indexOf(imgName) == -1) {
      dataArray.push(imgName);
    }
    SessionStorageService.setSessionValue(SessionStorage.GUIDED_TOUR,JSON.stringify(dataArray));
    return JSON.parse(SessionStorageService.getSessionValue(SessionStorage.GUIDED_TOUR));
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
