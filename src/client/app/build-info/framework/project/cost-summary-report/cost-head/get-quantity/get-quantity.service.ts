import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Project } from './../../../../model/project';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../../../shared/index';


@Injectable()
export class GetQuantityService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getCostHeadQuantityDetails(projectId:string, costHead: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var url = 'project/'+projectId+'/'+API.VIEW_BUILDING+'/'+buildingId+'/'+'costhead/'+costHead;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveCostHeadItems(costHeadId:number, subCategoryId : number, workItemId:number, quantityItemsArray:any) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var body= { 'item' : quantityItemsArray };
    var url = API.VIEW_PROJECT + '/' + projectId + '/'+ API.VIEW_BUILDING + '/' + buildingId
      + '/costhead/' + costHeadId + '/subcategory/'+ subCategoryId +'/workitem/' + workItemId + '/quantity';
    console.log('addCostHeadItems() url : '+url);
    return this.http.put(url,body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteQuantityItem(costHeadId:number, subCategoryId : number, workItemId:number, itemName: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let body = { item : itemName };
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var url = API.VIEW_PROJECT + '/' +  projectId + '/'+ API.VIEW_BUILDING + '/' + buildingId + '/'
      + 'costhead' + '/' + costHeadId + '/' + 'subcategory'+ '/' + subCategoryId + '/'+ 'workitem/' + workItemId + '/quantity' + '/item';
    console.log('deleteQuantityItems() url : '+url);
    return this.http.post(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
