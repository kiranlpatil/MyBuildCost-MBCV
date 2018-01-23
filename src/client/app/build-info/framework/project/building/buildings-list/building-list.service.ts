import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Building } from '../../../model/building';
import { Project } from '../../../model/project';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../../shared/index';


@Injectable()
export class BuildingListService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getProject(projectId: string): Observable<Project> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/'+ projectId;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteBuildingById(buildingId : any): Observable<Project> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)
      + '/'+ API.ADD_BUILDING + '/' + buildingId;
    return this.http.delete(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  updateBuildingByCostHead(cloneCostHead: any, clonedBuildingId:string) {
    let updateData = {'costHead' : cloneCostHead};
    var url =  API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)
      + '/'+ API.VIEW_BUILDING + '/'+ clonedBuildingId + '/clone';
    return this.http.put(url, updateData)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
