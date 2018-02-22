import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Project } from './../../model/project';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../shared/index';
import { UserProfile } from '../../../../user/models/user';
import { HttpDelegateService } from '../../../../shared/services/http-delegate-service/http-delegate.service';


@Injectable()
export class ProjectDetailsService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService, protected httpDelegateService : HttpDelegateService) {
    super();
  }

  getProjectDetails(projectId:string): Observable<Project> {
    var url = API.VIEW_PROJECT+'/'+projectId;
    return this.httpDelegateService.getAPI(url);
  }


  updateProjectDetails(modelProject: Project): Observable<UserProfile> {
    let url = API.VIEW_PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    return this.httpDelegateService.putAPI(url, modelProject);
  }

}
