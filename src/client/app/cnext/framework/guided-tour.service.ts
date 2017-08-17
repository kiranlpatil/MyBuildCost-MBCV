import { Injectable } from '@angular/core';
import {BaseService} from "../../framework/shared/httpservices/base.service";
import {LocalStorage} from "../../framework/shared/constants";
import {LocalStorageService} from "../../framework/shared/localstorage.service";
import {Observable} from "rxjs/Observable";
import {Headers, Http, RequestOptions} from "@angular/http";

@Injectable()

export class GuidedTourService extends BaseService {
 constructor(private http: Http) {
   super();
 }

  /*getTourStatus(): Observable<any> {
    //var data = LocalStorageService.getLocalValue(LocalStorage.GUIDED_TOUR);

    return this.http.get('./tour-guide.json');
  }

  updateTourStatus(imgName:string,simgSatus:boolean): Observable<any> { debugger
    var data = LocalStorageService.getLocalValue(LocalStorage.GUIDED_TOUR);
    var dataArray:GuidedTour[] = new Array(0);
    if(data == 'empty') {

    } else {
      dataArray = data;
    }

    return this.http.put('./tour-guide.json',LocalStorageService.setLocalValue(LocalStorage.GUIDED_TOUR,data));
  }*/

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
}
