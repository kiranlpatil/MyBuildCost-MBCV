import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Building } from './../../model/building';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../shared/index';
import {UserProfile} from "../../../../user/models/user";
import {ViewBuildingComponent} from "./viewBuilding.component";



@Injectable()
export class ViewBuildingService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getBuildingDetails(): Observable<Building> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'
      +API.VIEW_BUILDING+'/'+ SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  updateBuildingDetails(model: Building): Observable<UserProfile> {
    let url = API.VIEW_PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }


}
