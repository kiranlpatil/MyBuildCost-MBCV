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
    let url =API.PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'+API.BUILDING;
    return this.httpDelegateService.postAPI(url, building);
  }

  getBuilding(buildingId : string): Observable<Building> {
    var url = API.PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'
      +API.BUILDING+'/'+ buildingId;
    return this.httpDelegateService.getAPI(url);
  }

  updateBuilding(building: Building): Observable<Building> {
    var url = API.PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'
      +API.BUILDING+'/'+ SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    return this.httpDelegateService.putAPI(url, building);
  }

  deleteBuildingById(buildingId : any): Observable<Project> {
    var url = API.PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)
      + '/' + API.BUILDING + '/' + buildingId;
    return this.httpDelegateService.deleteAPI(url);
  }

  getBuildingDetailsForClone(buildingId : string): Observable<Building> {
    var url = API.PROJECT+'/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'
      +API.BUILDING+'/'+ buildingId +'/'+ API.CLONE;
    return this.httpDelegateService.getAPI(url);
  }

  cloneBuildingCostHeads(cloneCostHead: any, clonedBuildingId:string) {
    let updateData = {'costHead' : cloneCostHead};
    var url =  API.PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)
      + '/'+ API.BUILDING + '/'+ clonedBuildingId + '/' +API.CLONE;
    return this.httpDelegateService.putAPI(url, updateData);
  }

}
