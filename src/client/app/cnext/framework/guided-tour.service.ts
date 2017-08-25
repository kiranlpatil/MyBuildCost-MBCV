import {Injectable} from "@angular/core";
import {BaseService} from "../../framework/shared/httpservices/base.service";
import {LocalStorage, API} from "../../framework/shared/constants";
import {LocalStorageService} from "../../framework/shared/localstorage.service";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";

@Injectable()

export class GuidedTourService extends BaseService {
 constructor(private http: Http) {
   super();
 }

  getTourStatus(): Array<string> {
    var dataString = LocalStorageService.getLocalValue(LocalStorage.GUIDED_TOUR);
    return JSON.parse(dataString);
  }

  updateTourStatus(imgName:string,imgSatus:boolean): Array<string> {
    var dataString = LocalStorageService.getLocalValue(LocalStorage.GUIDED_TOUR);
    var dataArray:string[] = new Array(0);
    dataArray = JSON.parse(dataString);
    if(dataArray.indexOf(imgName) == -1) {
      dataArray.push(imgName);
    }
    LocalStorageService.setLocalValue(LocalStorage.GUIDED_TOUR,JSON.stringify(dataArray));
    return JSON.parse(LocalStorageService.getLocalValue(LocalStorage.GUIDED_TOUR));
  }

  updateProfileField(model:string[]):Observable<any> {
      var url = API.USER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID) + '/' + 'fieldname' + '/' + 'guide_tour';
      let body = JSON.stringify(model);
      return this.http.put(url, body)
        .map(this.extractData)
        .catch(this.handleError);
    //console.log(' You break your flow. please logout yourself');
  }

}
