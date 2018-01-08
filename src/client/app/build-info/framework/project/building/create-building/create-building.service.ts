import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Building } from '../../../model/building';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../../shared/index';


@Injectable()
export class CreateBuildingService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  addBuilding(building : Building): Observable<Building> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify(building);
    let ADD_BUILDING_API=API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)
      + '/' +API.ADD_BUILDING;
    return this.http.post(ADD_BUILDING_API, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
