import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Project } from './../../../model/project';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../../shared/index';


@Injectable()
export class CostHeadService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getCostHeadDetails(projectId:string, costHead: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var url = 'project/'+projectId+'/'+API.VIEW_BUILDING+'/'+buildingId+'/'+'costhead/'+costHead;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }



}
