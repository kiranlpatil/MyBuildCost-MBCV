import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Project } from './../model/project';
import { API, BaseService, MessageService, SessionStorageService, SessionStorage } from '../../../shared/index';
import { HttpDelegateService } from '../../../shared/services/http-delegate.service';

@Injectable()
export class ProjectService extends BaseService {

  constructor(protected messageService: MessageService,
              protected httpDelegateService : HttpDelegateService) {
    super();
  }

  getAllProjects(): Observable<Project> {
    var url = API.USER_ALL_PROJECTS;
    return this.httpDelegateService.getAPI(url);
  }

  createProject(project : Project): Observable<Project> {
    let url = API.PROJECT;
    return this.httpDelegateService.postAPI(url, project);
  }

  getProject(projectId:string): Observable<Project> {
    var url = API.PROJECT + '/' + projectId;
    return this.httpDelegateService.getAPI(url);
  }

  updateProject( projectId : string, modelProject : Project): Observable<Project> {
    let url = API.PROJECT + '/' + projectId;
    return this.httpDelegateService.putAPI(url, modelProject);
  }

  updateProjectStatus(projectId:string) {
  let url = API.PROJECT + '/' + projectId + '/' + API.ACTIVE_STATUS + '/' + API.ACTIVE_STATUS_FALSE ;
  let body = { };
    return this.httpDelegateService.putAPI(url,body);
  }

  updateProjectActiveStatus(projectId:string) {
  let url = API.PROJECT + '/' + projectId + '/' + API.ACTIVE_STATUS + '/' + API.ACTIVE_STATUS_TRUE ;
  let body = { };
    return this.httpDelegateService.putAPI(url,body);
  }

  updateProjectNameById(projectId:string,  body : any) {
    let url = API.PROJECT + '/' + projectId +'/'+ API.PROJECT_NAME;
    return this.httpDelegateService.putAPI(url,body);
  }

}
