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
  deleteWorkItemDetails(workItemName: string, costHead: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
     var url = 'project/'+projectId+'/'+API.VIEW_BUILDING+'/'+buildingId+'/'+'costhead/'+costHead+'/workitem/'+workItemName;
    return this.http.delete(url, options)
      .map(this.extractData)
      .catch(this.handleError);
    /*router.delete('/:id/building/:buildingid/costhead/:costhead/workitem/:workitem'*/
  }


  getQuantity(costHeadName:any,costHeadItem:any){
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
     '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
    '/' + API.QUANTITY + '/' + costHeadName + '/workitem/'+costHeadItem ;// +costHeadItem;
    console.log('Get Quantity url : '+url);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  deleteCostHeadItems(costHeadName:any,workItem:any,costHeadItem_Item:any){
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/' + API.QUANTITY + '/' + costHeadName + '/workitem/' + workItem + '/item/' +costHeadItem_Item;// +costHeadItem;
    console.log('deleteCostHeadItems() url : '+url);
    return this.http.delete(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addCostHeadItems(costHeadName:any,workItem:any,body:any) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/costhead/' + costHeadName + '/workitem/' + workItem + '/quantity';// +costHeadItem;
    console.log('addCostHeadItems() url : '+url);
    return this.http.post(url, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveCostHeadItems(costHeadName:any,workItem:any,quantityItemsArray:any) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var body=quantityItemsArray;
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/costhead/' + costHeadName + '/workitem/' + workItem + '/quantity';// +costHeadItem;
    console.log('addCostHeadItems() url : '+url);
    return this.http.put(url,body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getRateItems(costHeadName:any,workItem:any) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/' + API.RATE + '/costhead/' + costHeadName + '/workitem/'+workItem ;// +costHeadItem;
    console.log('getRateItems url : '+url);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


}
