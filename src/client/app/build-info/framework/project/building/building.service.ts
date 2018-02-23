import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Building } from '../../model/building';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../shared/index';
import { HttpDelegateService } from '../../../../shared/services/http-delegate-service/http-delegate.service';
import { Project } from '../../model/project';


@Injectable()
export class BuildingService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService, protected httpDelegateService : HttpDelegateService) {
    super();
  }

  createBuilding(building : Building): Observable<Building> {
    let url =API.VIEW_PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'+API.ADD_BUILDING;
    return this.httpDelegateService.postAPI(url, building);
  }

  getBuilding(buildingId : string): Observable<Building> {
    var url = API.VIEW_PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'
      +API.VIEW_BUILDING+'/'+ buildingId;
    return this.httpDelegateService.getAPI(url);
  }

  updateBuilding(building: Building): Observable<Building> {
    var url = API.VIEW_PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'
      +API.VIEW_BUILDING+'/'+ SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    return this.httpDelegateService.putAPI(url, building);
  }

  deleteBuildingById(buildingId : any): Observable<Project> {
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)
      + '/' + API.ADD_BUILDING + '/' + buildingId;
    return this.httpDelegateService.deleteAPI(url);
  }

  getBuildingDetailsForClone(buildingId : string): Observable<Building> {
    var url = API.VIEW_PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'
      +API.VIEW_BUILDING+'/'+ buildingId +'/'+ API.CLONE;
    return this.httpDelegateService.getAPI(url);
  }

  cloneBuildingCostHeads(cloneCostHead: any, clonedBuildingId:string) {
    let updateData = {'costHead' : cloneCostHead};
    var url =  API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)
      + '/'+ API.VIEW_BUILDING + '/'+ clonedBuildingId + '/clone';
    return this.httpDelegateService.putAPI(url, updateData);
  }

  //TODO : Remove this method
  getProject(projectId: string): Observable<Project> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/'+ projectId;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
