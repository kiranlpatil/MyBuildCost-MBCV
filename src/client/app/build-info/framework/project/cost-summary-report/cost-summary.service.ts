import { Injectable } from '@angular/core';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../shared/index';
import { HttpDelegateService } from '../../../../shared/services/http-delegate.service';

@Injectable()
export class CostSummaryService extends BaseService {

  constructor(protected messageService: MessageService, protected httpDelegateService : HttpDelegateService) {
    super();
  }

  //Report changes
  getCostSummaryReport(projectId: string,defaultCostIn:string,defaultCostPer:string) {

    var url = API.THUMBRULE_RULE_RATE + '/'+ API.PROJECT +'/'+projectId+'/';
    url =  ( defaultCostIn==='Rs/Sqft' ) ? ( url + API.RATE + '/' + API.SQFT ) : ( url + API.RATE + '/' + API.SQM );
    url= ( defaultCostPer==='SlabArea' ) ?  ( url + '/'+ API.AREA +'/' + API.SLAB_AREA ) :  ( url + '/'+ API.AREA +'/' +
      API.SALEABLE_AREA );

    return this.httpDelegateService.getAPI(url);
  }

  updateRateOfThumbRule(projectId : string, buildingId : string, costHeadName : string,
                        costIn : string, costPer : string, buildingArea : number, amount : number) {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' + API.COSTHEAD ;
    var body = {
      budgetedCostAmount : amount,
      costIn : costIn,
      costPer : costPer,
      costHead : costHeadName,
      buildingArea : buildingArea
    };

    return this.httpDelegateService.putAPI(url, body);
  }

  // Cost Head CRUD API
  inActiveCostHead(projectId:string, buildingId:string, costHeadId:number) {
    var url =  API.PROJECT + '/'+ projectId +'/'+ API.BUILDING +'/'+ buildingId +'/'+ API.COSTHEAD +'/'+
      costHeadId +'/'+ API.ACTIVE_STATUS +'/'+ API.ACTIVE_STATUS_FALSE;
    let body = {};

    return this.httpDelegateService.putAPI(url, body);
  }

  getAllInActiveCostHeads(projectId : string, buildingId : string) {
    var url = API.PROJECT + '/'+ projectId + '/'+ API.BUILDING + '/' + buildingId + '/' + API.COSTHEAD;

    return this.httpDelegateService.getAPI(url);
  }

  // Reconsider this method
  activeCostHead( projectId : string, buildingId : string, selectedInActiveCostHeadId : number) {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/'+ API.COSTHEAD +'/' +
      selectedInActiveCostHeadId +'/'+ API.ACTIVE_STATUS + '/' + API.ACTIVE_STATUS_TRUE;
    let body = {};

    return this.httpDelegateService.putAPI(url, body);
  }

  getInActiveCategories(projectId : string, buildingId : string, costHeadId : number) {
    var url =  API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' +
      API.COSTHEAD +'/' + costHeadId + '/' + API.CATEGORYLIST;

    return this.httpDelegateService.getAPI(url);
  }

  // WorkItem  CRUD API
  deactivateWorkItem(projectId : string, buildingId : string, costHeadId : number, subCategoryId : number, workItemId : number) {
    var url =  API.PROJECT + '/'+ projectId +'/'+ API.BUILDING +'/'+ buildingId +'/'+ API.COSTHEAD +'/'+
      costHeadId + '/'+ API.CATEGORY +'/'+ subCategoryId +'/' + API.WORKITEM + '/' + workItemId +'/'+
      API.ACTIVE_STATUS +'/'+ API.ACTIVE_STATUS_FALSE;
    let body = {};

    return this.httpDelegateService.putAPI(url, body);
  }

  getInActiveWorkItems( projectId : string, buildingId : string, costHeadId : number, subCategoryId : number) {
    var url = API.PROJECT + '/'+ projectId + '/'+ API.BUILDING + '/' + buildingId + '/' + API.COSTHEAD+'/'+
      costHeadId + '/'+ API.CATEGORY  +'/'+ subCategoryId +'/' + API.WORKITEM ;

    return this.httpDelegateService.getAPI(url);
  }

  activateWorkItem(projectId : string, buildingId : string, costHeadId : number, subCategoryId : number, workItemId : number) {
    var url =  API.PROJECT + '/'+ projectId +'/'+ API.BUILDING +'/'+ buildingId +'/'+ API.COSTHEAD +'/'+
      costHeadId + '/'+ API.CATEGORY +'/'+ subCategoryId +'/' + API.WORKITEM + '/' + workItemId +'/'+
      API.ACTIVE_STATUS +'/'+ API.ACTIVE_STATUS_TRUE;
    let body = {};

    return this.httpDelegateService.putAPI(url, body);
  }

  // Quantity API (Not in use)
  getQuantity(costHeadName:any,costHeadItem:any) {
    var url = API.PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID)+
      '/'+ API.BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/' + API.QUANTITY + '/' + costHeadName + '/' + API.WORKITEM + '/'+costHeadItem ;

    return this.httpDelegateService.getAPI(url);
  }

  updateQuantityItems( projectId : string, buildingId : string, costHeadId : number, categoryId : number, workItemId : number,
                      quantityItemsArray : any) {
    var body= { item : quantityItemsArray };
    var url = API.PROJECT + '/' + projectId + '/'+ API.BUILDING + '/' + buildingId + '/'+ API.COSTHEAD +'/' + costHeadId +
      '/'+ API.CATEGORY +'/'+ categoryId +'/' + API.WORKITEM + '/' + workItemId + '/'+ API.QUANTITY;

    return this.httpDelegateService.putAPI(url, body);
  }

  deleteQuantityItem( projectId : string, buildingId : string, costHeadId : number, categoryId : number,
                      workItemId : number, itemName : string) {
    let body = { item : itemName };
    let url = API.PROJECT + '/' +  projectId + '/' + API.BUILDING + '/' + buildingId + '/' + API.COSTHEAD + '/' +
      costHeadId + '/' + API.CATEGORY + '/' + categoryId + '/' + API.WORKITEM +
      '/' + workItemId + '/' + API.QUANTITY + '/' + API.ITEM;

    return this.httpDelegateService.postAPI(url, body);
  }

  //Rate API
  updateRate( projectId : string, buildingId : string, costheadId : number,categoryId : number, workItemId : number,
              rateItemsArray : any) {
    var body=rateItemsArray;
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' + API.RATE + '/' + API.COSTHEAD+ '/' +
      costheadId + '/' + API.CATEGORY + '/' + categoryId + '/' + API.WORKITEM + '/' + workItemId ;

    return this.httpDelegateService.putAPI(url, body);
  }

  getRateItems( projectId : String, buildingId : string, costheadId : number, categoryId : number, workItemId : number) {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' + API.RATE + '/'+ API.COSTHEAD +'/' +
      costheadId + '/' + API.CATEGORY + '/'+categoryId + '/' + API.WORKITEM + '/'+workItemId ;

    return this.httpDelegateService.getAPI(url);
  }

  //Category API
  getActiveCategories(projectId: string, buildingId : string, costheadId : number) {
    var url = API.PROJECT +'/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/'
      + API.COSTHEAD+ '/' + costheadId + '/' + API.CATEGORY;

    return this.httpDelegateService.getAPI(url);
  }

  //In Active Category
  deactivateCategory(projectId : String, buildingId : string, costHeadId : number, categoryId : any) {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/'+ API.COSTHEAD +'/' +
      costHeadId +'/' + API.CATEGORY + '/' + categoryId + '/' + API.ACTIVE_STATUS + '/' + API.ACTIVE_STATUS_FALSE;
    let body = {};

    return this.httpDelegateService.putAPI(url, body);
  }

  //Active Category
  activateCategory(projectId : string, buildingId : string, costHeadId : number, categoryId : number) {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/'+ API.COSTHEAD +'/' +
      costHeadId +'/' + API.CATEGORY + '/' + categoryId + '/' + API.ACTIVE_STATUS + '/' + API.ACTIVE_STATUS_TRUE;
    let body = {};

    return this.httpDelegateService.putAPI(url, body);
  }
}
