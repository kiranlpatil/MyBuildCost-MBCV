import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../shared/index';
import { HttpDelegateService } from './../../../../shared/services/http-delegate-service/http-delegate.service';

@Injectable()
export class CostSummaryService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService, protected httpDelegateService : HttpDelegateService) {
    super();
  }

  // TODO : Remove these both methods from this service

  getProjectDetails(projectId: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/'+ projectId;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getBuildingDetails(projectId: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/'+ projectId +'/'+ API.ADD_BUILDING +
      '/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  //Report changes
  getCostSummaryReport(projectId: string,defaultCostIn:string,defaultCostPer:string) {

    var url = API.THUMBRULE_RULE_RATE + '/'+ API.VIEW_PROJECT +'/'+projectId+'/';

    if(defaultCostIn==='Rs/Sqft') {
      url=url + 'rate/' + API.SQFT;
    }    else {
      url=url + 'rate/' + API.SQM;
    }


    if(defaultCostPer==='SlabArea') {
      url=url + '/area/' + API.SLAB_AREA;
    }    else {
      url=url + '/area/' + API.SALEABLE_AREA;
    }

    return this.httpDelegateService.getAPI(url);
  }

  updateBudgetedCost(buildingId : string, costHeadName : string,
                     costIn : string, costPer : string, buildingArea : number, amount:number) {
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +buildingId+ '/costhead';
    var body = {
      'budgetedCostAmount' : amount,
      'costIn' : costIn,
      'costPer' : costPer,
      'costHead' : costHeadName,
      'buildingArea' : buildingArea
    };
    return this.httpDelegateService.putAPI(url, body);
  }

  // Cost Head CRUD API
  inActiveCostHead(buildingId:string, costHeadId:number) {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    var url = 'project/'+projectId+'/'+API.VIEW_BUILDING+'/'+buildingId+'/'+'costHead/'+costHeadId+'/false';
    let body = {};
    return this.httpDelegateService.putAPI(url, body);
  }

  getInActiveCostHeads(projectId: string,buildingId: string) {
    var url = API.VIEW_PROJECT + '/'+ projectId +'/'+ API.VIEW_BUILDING + '/' +buildingId + '/costhead';
    return this.httpDelegateService.getAPI(url);
  }

  // Reconsider this method
  activeCostHead(selectedInactiveCostHeadId:number,projectId:string,buildingId:string) {
    var url = API.VIEW_PROJECT + '/'+ projectId +'/'+ API.VIEW_BUILDING + '/'
      +buildingId + '/costHead/' +selectedInactiveCostHeadId+'/true';
    let body = {};
    return this.httpDelegateService.putAPI(url, body);
  }

  getSubCategoryList(costheadId: number) {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var url = 'project/'+projectId+'/'+API.VIEW_BUILDING+'/'+buildingId+'/'+'costhead/'+costheadId+'/'+'subcategorylist';
    return this.httpDelegateService.getAPI(url);
  }

  getCostHeadDetails(projectId:string, costHead: string) {
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var url = 'project/'+projectId+'/'+API.VIEW_BUILDING+'/'+buildingId+'/'+'costhead/'+costHead;
    return this.httpDelegateService.getAPI(url);
  }

  // Quantity API
  getQuantity(costHeadName:any,costHeadItem:any) {
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/' + API.QUANTITY + '/' + costHeadName + '/workitem/'+costHeadItem ;
    return this.httpDelegateService.getAPI(url);
  }

  updateQuantityItems(costHeadId:number, subCategoryId : number, workItemId:number, quantityItemsArray:any) {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var body= { 'item' : quantityItemsArray };
    var url = API.VIEW_PROJECT + '/' + projectId + '/'+ API.VIEW_BUILDING + '/' + buildingId
      + '/costhead/' + costHeadId + '/subcategory/'+ subCategoryId +'/workitem/' + workItemId + '/quantity';
    return this.httpDelegateService.putAPI(url, body);
  }

  deleteQuantityItem(costHeadId:number, subCategoryId : number, workItemId:number, itemName: string) {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let body = { item : itemName };
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var url = API.VIEW_PROJECT + '/' +  projectId + '/'+ API.VIEW_BUILDING + '/' + buildingId + '/'
      + 'costhead' + '/' + costHeadId + '/' + 'subcategory'+ '/' + subCategoryId + '/'+ 'workitem/' + workItemId + '/quantity' + '/item';
    return this.httpDelegateService.postAPI(url, body);
  }

  //Rate API
  updateRate(costheadId:number,subCategoryId:number,workItemId:number,rateItemsArray:any) {
    var body=rateItemsArray;
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/' + API.RATE + '/costhead/' + costheadId + '/subcategory/'+subCategoryId + '/workitem/'+workItemId ;
    return this.httpDelegateService.putAPI(url, body);
  }

  updateRateItems(costheadId:number,subCategoryId:number,workItemId:number,rateItemsArray:any) {
    var body=rateItemsArray;
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/' + API.RATE + '/costhead/' + costheadId + '/subcategory/'+subCategoryId + '/workitem/'+workItemId ;
    return this.httpDelegateService.putAPI(url, body);
  }

  getRateItems(costheadId:number,subCategoryId:number,workItemId:number) {
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/' + API.RATE + '/costhead/' + costheadId + '/subcategory/'+subCategoryId + '/workitem/'+workItemId ;
    return this.httpDelegateService.getAPI(url);
  }

  //SubCategory API
  getSubCategoryDetails(projectId: string,costheadId: number) {
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var url = 'project/'+projectId+'/'+API.VIEW_BUILDING+'/'+buildingId+'/'+'costhead/'+costheadId+'/'+'subcategory';
    return this.httpDelegateService.getAPI(url);
  }

  deleteSubCategory(costHeadId:number, subcategory:any) {
    let body = {
      'name' : subcategory.name,
      'rateAnalysisId' : subcategory.rateAnalysisId
    };
    let url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/costhead/' + costHeadId + '/subcategory';

    return this.httpDelegateService.putAPI(url, body);
  }

  addSubCategory( selectedSubCategory:any, costHeadId:number ) {
    var url = API.VIEW_PROJECT + '/'+
      SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT) +'/'+
      API.VIEW_BUILDING + '/' +
      SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING) +
      '/costhead/' +costHeadId+'/subcategory';
    var body = {
      'subCategory' : selectedSubCategory[0].subCategory,
      'subCategoryId' : selectedSubCategory[0].rateAnalysisId
    };
    return this.httpDelegateService.postAPI(url, body);
  }

  //Quantity Items API
  deleteCostHeadItems(costHeadId:number, subCategoryId : number, workItemId:number, quantityItemsArray:any, itemName: string) {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let body = { item : itemName };
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var url = API.VIEW_PROJECT + '/' +  projectId +
      '/'+ API.VIEW_BUILDING + '/' + buildingId + '/' + 'costhead' + '/' + costHeadId + '/' + 'subcategory'+ '/' +
      subCategoryId + '/'+ 'workitem/' + workItemId + '/quantity' + '/item';
    return this.httpDelegateService.postAPI(url, body);
  }

  addCostHeadItems(costHeadName:any,workItem:any,body:any) {
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/costhead/' + costHeadName + '/workitem/' + workItem + '/quantity';
    return this.httpDelegateService.postAPI(url, body);
  }

  saveCostHeadItems(costHeadId:number, subCategoryId : number, workItemId:number, quantityItemsArray:any) {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var body= { 'item' : quantityItemsArray };
    var url = API.VIEW_PROJECT + '/' + projectId + '/'+ API.VIEW_BUILDING + '/' + buildingId + '/costhead/' + costHeadId +
      '/subcategory/'+ subCategoryId +'/workitem/' + workItemId + '/quantity';
    return this.httpDelegateService.putAPI(url, body);
  }

  //Workitems API
  getWorkItemList(costheadId:number,subCategoryId:number) {
    var url = API.VIEW_PROJECT + '/'+  SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'
      + API.VIEW_BUILDING + '/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+'/costhead/'
      + costheadId + '/subcategory/'+subCategoryId + '/workitemlist';
    return this.httpDelegateService.getAPI(url);
  }

  addWorkItem(costheadId:number,subCategoryId:number,selectedWorkItemRateAnalysisId:number,selectedWorkItemName:string) {
    let body= {
      'rateAnalysisId': selectedWorkItemRateAnalysisId,
      'name': selectedWorkItemName
    };
    var url = API.VIEW_PROJECT + '/'+  SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+'/'
      + API.VIEW_BUILDING + '/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+'/costhead/'
      + costheadId + '/subcategory/'+subCategoryId + '/workitem';
    return this.httpDelegateService.postAPI(url, body);
  }

  deleteWorkItem(costHeadId:number, subCategoryId:number,workItemId:number) {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    var url = API.VIEW_PROJECT + '/' + projectId + '/'+ API.VIEW_BUILDING + '/' + buildingId
      + '/costhead/' + costHeadId + '/subcategory/'+ subCategoryId +'/workitem/' + workItemId;
    return this.httpDelegateService.deleteAPI(url);
  }
}
