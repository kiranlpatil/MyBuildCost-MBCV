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
    url =  ( defaultCostIn==='Rs/Sqft' ) ? ( url + 'rate/' + API.SQFT ) : ( url + 'rate/' + API.SQM );
    url= ( defaultCostPer==='SlabArea' ) ?  ( url + '/area/' + API.SLAB_AREA ) :  ( url + '/area/' + API.SALEABLE_AREA );

    return this.httpDelegateService.getAPI(url);
  }

  updateBudgetedCost( projectId : string, buildingId : string, costHeadName : string,
                     costIn : string, costPer : string, buildingArea : number, amount : number) {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/costhead';
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
    var url = 'project/'+projectId+'/'+API.BUILDING+'/'+buildingId+'/'+'costHead/'+costHeadId+'/'+'activeStatus'+'/false';
  let body = {};

    return this.httpDelegateService.putAPI(url, body);
  }

  getInActiveCostHeads( projectId : string, buildingId : string) {
    var url = API.PROJECT + '/'+ projectId + '/'+ API.BUILDING + '/' + buildingId + '/costhead';
    return this.httpDelegateService.getAPI(url);
  }

  // Reconsider this method
  activeCostHead( projectId : string, buildingId : string, selectedInactiveCostHeadId : number) {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/costHead/' +
      selectedInactiveCostHeadId +'/'+'activeStatus'+ '/true';
    let body = {};

    return this.httpDelegateService.putAPI(url, body);
  }

  getSubCategoryList( projectId : string, buildingId : string, costheadId : number) {
    var url = 'project/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' + 'costhead/' + costheadId + '/' + 'subcategorylist';

    return this.httpDelegateService.getAPI(url);
  }

  // Quantity API (Not in use)
  getQuantity(costHeadName:any,costHeadItem:any) {
    var url = API.PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID)+
      '/'+ API.BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/' + API.QUANTITY + '/' + costHeadName + '/workitem/'+costHeadItem ;

    return this.httpDelegateService.getAPI(url);
  }

  updateQuantityItems( projectId : string, buildingId : string, costHeadId : number, subCategoryId : number, workItemId : number,
                      quantityItemsArray : any) {
    var body= { item : quantityItemsArray };
    var url = API.PROJECT + '/' + projectId + '/'+ API.BUILDING + '/' + buildingId + '/costhead/' + costHeadId +
      '/subcategory/'+ subCategoryId +'/workitem/' + workItemId + '/quantity';

    return this.httpDelegateService.putAPI(url, body);
  }

  deleteQuantityItem( projectId : string, buildingId : string, costHeadId : number, subCategoryId : number,
                      workItemId : number, itemName : string) {
    let body = { item : itemName };
    let url = API.PROJECT + '/' +  projectId + '/' + API.BUILDING + '/' + buildingId + '/' + 'costhead' + '/' +
      costHeadId + '/' + 'subcategory' + '/' + subCategoryId + '/' + 'workitem/' + workItemId + '/quantity' + '/item';

    return this.httpDelegateService.postAPI(url, body);
  }

  //Rate API
  updateRate( projectId : string, buildingId : string, costheadId : number,subCategoryId : number, workItemId : number,
              rateItemsArray : any) {
    var body=rateItemsArray;
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' + API.RATE + '/costhead/' +
      costheadId + '/subcategory/' + subCategoryId + '/workitem/' + workItemId ;

    return this.httpDelegateService.putAPI(url, body);
  }

  getRateItems( projectId : String, buildingId : string, costheadId : number, subCategoryId : number, workItemId : number) {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' + API.RATE + '/costhead/' +
      costheadId + '/subcategory/'+subCategoryId + '/workitem/'+workItemId ;

    return this.httpDelegateService.getAPI(url);
  }

  //SubCategory API
  getSubCategory( projectId: string, buildingId : string, costheadId : number) {
    var url = 'project/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' + 'costhead/' + costheadId + '/' + 'subcategory';

    return this.httpDelegateService.getAPI(url);
  }

  deleteSubCategory( projectId : String, buildingId : string, costHeadId : number, subcategory : any) {
    let body = {
      name : subcategory.name,
      rateAnalysisId : subcategory.rateAnalysisId
    };
    let url = API.PROJECT + '/' + projectId + '/'+ API.BUILDING + '/' + buildingId + '/costhead/' + costHeadId + '/subcategory';

    return this.httpDelegateService.putAPI(url, body);
  }

  addSubCategory( projectId : string, buildingId : string, costHeadId : number, selectedSubCategory : any ) {
    let url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/costhead/' + costHeadId + '/subcategory';
    let body = {
      subCategory : selectedSubCategory[0].subCategory,
      subCategoryId : selectedSubCategory[0].rateAnalysisId
    };

    return this.httpDelegateService.postAPI(url, body);
  }

  //Workitems API
  getWorkItemList( projectId : string, buildingId : string, costheadId : number, subCategoryId : number) {
    var url = API.PROJECT + '/' +  projectId + '/' + API.BUILDING + '/' + buildingId + '/costhead/' + costheadId +
      '/subcategory/' +subCategoryId + '/workitemlist';

    return this.httpDelegateService.getAPI(url);
  }

  addWorkItem( projectId : string, buildingId : String, costheadId : number, subCategoryId : number,
               selectedWorkItemRateAnalysisId : number, selectedWorkItemName : string) {
    let body= {
      rateAnalysisId : selectedWorkItemRateAnalysisId,
      name : selectedWorkItemName
    };
    var url = API.PROJECT + '/'+  projectId + '/' + API.BUILDING + '/' + buildingId + '/costhead/' + costheadId +
      '/subcategory/' + subCategoryId + '/workitem';

    return this.httpDelegateService.postAPI(url, body);
  }

  deleteWorkItem( projectId : string, buildingId : String, costHeadId : number, subCategoryId : number,workItemId : number) {
    var url = API.PROJECT + '/' + projectId + '/'+ API.BUILDING + '/' + buildingId
      + '/costhead/' + costHeadId + '/subcategory/'+ subCategoryId +'/workitem/' + workItemId;

    return this.httpDelegateService.deleteAPI(url);
  }
}
