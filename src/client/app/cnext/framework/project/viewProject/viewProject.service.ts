import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Project } from './../../model/project';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../shared/index';


@Injectable()
export class ViewProjectService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getProjectDetails(): Observable<Project> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }



}
