import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Building } from '../../model/building';
import { API, BaseService, MessageService } from '../../../../shared/index';
import { HttpDelegateService } from '../../../../shared/services/http-delegate.service';
import { Project } from '../../model/project';


@Injectable()
export class BuildingService extends BaseService {

  constructor(protected messageService: MessageService, protected httpDelegateService : HttpDelegateService) {
    super();
  }

  createBuilding( projectId : string, building : Building): Observable<Building> {
    let url =API.PROJECT + '/' + projectId + '/' + API.BUILDING;
    return this.httpDelegateService.postAPI(url, building);
  }

  getBuilding( projectId : string, buildingId : string): Observable<Building> {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId;
    return this.httpDelegateService.getAPI(url);
  }

  updateBuilding( projectId : string, buildingId : string, building : Building): Observable<Building> {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId;
    return this.httpDelegateService.putAPI(url, building);
  }

  deleteBuilding(projectId : string, buildingId : string): Observable<Project> {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId;
    return this.httpDelegateService.deleteAPI(url);
  }

  getBuildingDetailsForClone( projectId : string, buildingId : string): Observable<Building> {
    var url = API.PROJECT + '/' + projectId + '/' +API.BUILDING + '/' + buildingId + '/' + API.CLONE;
    return this.httpDelegateService.getAPI(url);
  }

  cloneBuildingCostHeads( projectId : string, clonedBuildingId : string, cloneCostHead : any) {
    let updateData = {'costHead' : cloneCostHead};
    var url =  API.PROJECT + '/' + projectId  + '/'+ API.BUILDING + '/' + clonedBuildingId + '/' +API.CLONE;
    return this.httpDelegateService.putAPI(url, updateData);
  }

  syncBuildingWithRateAnalysis( projectId : string, buildingId : string): Observable<Building> {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' + API.SYNC_RATE_ANALYSIS;
    return this.httpDelegateService.getAPI(url);
  }

}
