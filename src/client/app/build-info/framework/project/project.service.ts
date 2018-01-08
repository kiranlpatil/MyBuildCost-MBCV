import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Project } from './../model/project';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../shared/index';


@Injectable()
export class ProjectService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getProject(): Observable<Project> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.USER_ALL_PROJECTS;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  createProject(project : Project): Observable<Project> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify(project);
    return this.http.post(API.VIEW_PROJECT, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
