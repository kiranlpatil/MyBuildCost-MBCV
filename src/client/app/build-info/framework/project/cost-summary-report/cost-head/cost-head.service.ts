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
  getSubCategory(projectId: string,costheadId: number) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
   let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var url = 'project/'+projectId+'/'+API.VIEW_BUILDING+'/'+buildingId+'/'+'costhead/'+costheadId+'/'+'subcategory';
    console.log(url);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
}

  getSubCategoryList(costheadId: number) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    var url = 'project/'+projectId+'/'+API.VIEW_BUILDING+'/'+buildingId+'/'+'costhead/'+costheadId+'/'+'subcategorylist';

    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
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


  deleteCostHeadItems(costHeadId:number, subCategoryId : number, workItemId:number, quantityItemsArray:any, itemName: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let body = { item : itemName };
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var url = API.VIEW_PROJECT + '/' +  projectId +
      '/'+ API.VIEW_BUILDING + '/' + buildingId + '/' + 'costhead' + '/' + costHeadId + '/' + 'subcategory'+ '/' + subCategoryId + '/'+ 'workitem/' + workItemId + '/quantity' + '/item';
    console.log('deleteQuantityItems() url : '+url);
    return this.http.post(url, body, options)
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

  saveCostHeadItems(costHeadId:number, subCategoryId : number, workItemId:number, quantityItemsArray:any) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
   var body= { 'item' : quantityItemsArray };
   //var body=  quantityItemsArray;
    var url = API.VIEW_PROJECT + '/' + projectId + '/'+ API.VIEW_BUILDING + '/' + buildingId + '/costhead/' + costHeadId + '/subcategory/'+ subCategoryId +'/workitem/' + workItemId + '/quantity';
    console.log('addCostHeadItems() url : '+url);
    return this.http.put(url,body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRateItems(costheadId:number,subCategoryId:number,workItemId:number) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/' + API.RATE + '/costhead/' + costheadId + '/subcategory/'+subCategoryId + '/workitem/'+workItemId ;// +costHeadItem;
    console.log('getRateItems url : '+url);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  showWorkItem(costheadId:number,subCategoryId:number) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/'+  SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'
      + API.VIEW_BUILDING + '/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+'/costhead/'
      + costheadId + '/subcategory/'+subCategoryId + '/workitemlist';// +costHeadItem;
    console.log('showWorkItem url : '+url);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  addWorkItem(costheadId:number,subCategoryId:number,selectedWorkItemRateAnalysisId:number,selectedWorkItemName:string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body={
      'rateAnalysisId': selectedWorkItemRateAnalysisId,
      'name': selectedWorkItemName
    }
    var url = API.VIEW_PROJECT + '/'+  SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'
      + API.VIEW_BUILDING + '/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+'/costhead/'
      + costheadId + '/subcategory/'+subCategoryId + '/workitem';// +costHeadItem;
    console.log('addWorkItem url : '+url);
    return this.http.post(url,body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  updateRateItems(costheadId:number,subCategoryId:number,workItemId:number,rateItemsArray:any) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var body=rateItemsArray;
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/' + API.RATE + '/costhead/' + costheadId + '/subcategory/'+subCategoryId + '/workitem/'+workItemId ;// +costHeadItem;
    console.log('updateRateItems url : '+url);
    return this.http.put(url,body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteSubcategoryFromCostHead(costHeadId:number, subcategory:any) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = {
      'name' : subcategory.name,
      'rateAnalysisId' : subcategory.rateAnalysisId
    };
    let url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/costhead/' + costHeadId + '/subcategory';

    return this.http.put(url,body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addSubCategory( selectedSubCategory:any, costHeadId:number ) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/'+
      SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT) +'/'+
      API.VIEW_BUILDING + '/' +
      SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING) +
      '/costhead/' +costHeadId+'/subcategory';
    var body = {
      'subCategory' : selectedSubCategory[0].subCategory,
      'subCategoryId' : selectedSubCategory[0].rateAnalysisId
    };
    return this.http.post(url, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }



}
