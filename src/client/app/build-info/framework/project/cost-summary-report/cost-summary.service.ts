import { Injectable } from '@angular/core';
import {
  API, BaseService, SessionStorage, SessionStorageService, MessageService,
  AppSettings
} from '../../../../shared/index';
import { HttpDelegateService } from '../../../../shared/services/http-delegate.service';
import { QuantityItem } from '../../model/quantity-item';
import { Rate } from '../../model/rate';
import { ProjectElements } from '../../../../shared/constants';
import { QuantityDetails } from '../../model/quantity-details';

declare let $: any;

@Injectable()
export class CostSummaryService extends BaseService {


  constructor(protected messageService: MessageService, protected httpDelegateService : HttpDelegateService) {
    super();
  }

  //Report changes
  getCostSummaryReport(projectId: string,defaultCostIn:string,defaultCostPer:string) {

    var url = API.THUMBRULE_RULE_RATE + '/'+ API.PROJECT +'/'+projectId+'/';
    url =  ( defaultCostIn === ProjectElements.RS_PER_SQFT ) ? ( url + API.RATE + '/' + API.SQFT ) : ( url + API.RATE + '/' + API.SQM );
    url= ( defaultCostPer === ProjectElements.SLAB_AREA ) ?  ( url + '/'+ API.AREA +'/' + API.SLAB_AREA ) :
      (( defaultCostPer === ProjectElements.CARPET_AREA ) ? ( url + '/'+ API.AREA +'/' + API.CARPET_AREA ) :
        ( url + '/'+ API.AREA +'/' + API.SALEABLE_AREA ));

    return this.httpDelegateService.getAPI(url);
  }

  changeBudgetedCostAmountOfBuildingCostHead(projectId : string, buildingId : string, costHeadName : string, amount : number) {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' + API.COSTHEAD ;
    var body = {
      budgetedCostAmount : amount,
      costHead : costHeadName
    };

    return this.httpDelegateService.putAPI(url, body);
  }

  changeBudgetedCostAmountOfProjectCostHead(projectId : string, costHeadName : string, amount : number) {

    var url = API.PROJECT + '/' + projectId + '/' + API.COSTHEAD + '/' + API.BUDGETED_COST;
    var body = {
      budgetedCostAmount : amount,
      costHead : costHeadName
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

  getAllInActiveProjectCostHeads(projectId : string) {
    var url = API.PROJECT + '/'+ projectId + '/' + API.COSTHEAD;

    return this.httpDelegateService.getAPI(url);
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

  activateProjectCostHead( projectId : string, selectedInActiveCostHeadId : number) {
    var url = API.PROJECT + '/' + projectId + '/' + API.COSTHEAD +'/' +
      selectedInActiveCostHeadId +'/'+ API.ACTIVE_STATUS + '/' + API.ACTIVE_STATUS_TRUE;
    let body = {};

    return this.httpDelegateService.putAPI(url, body);
  }

  inactivateProjectCostHead( projectId : string, selectedInActiveCostHeadId : number) {
    var url = API.PROJECT + '/' + projectId + '/' + API.COSTHEAD +'/' +
      selectedInActiveCostHeadId +'/'+ API.ACTIVE_STATUS + '/' + API.ACTIVE_STATUS_FALSE;
    let body = {};

    return this.httpDelegateService.putAPI(url, body);
  }

  getInActiveCategories(projectId : string, buildingId : string, costHeadId : number) {
    var url =  API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' +
      API.COSTHEAD +'/' + costHeadId + '/' + API.CATEGORYLIST;

    return this.httpDelegateService.getAPI(url);
  }

  // WorkItem  CRUD API
  deactivateWorkItem( baseUrl: string, costHeadId : number, subCategoryId : number, workItemId : number) {
    var url =  baseUrl +'/'+ API.COSTHEAD +'/'+
      costHeadId + '/'+ API.CATEGORY +'/'+ subCategoryId +'/' + API.WORKITEM + '/' + workItemId +'/'+
      API.ACTIVE_STATUS +'/'+ API.ACTIVE_STATUS_FALSE;
    let body = {};

    return this.httpDelegateService.putAPI(url, body);
  }

  getInActiveWorkItems( baseUrl: string, costHeadId : number, subCategoryId : number) {
    var url = baseUrl + '/' + API.COSTHEAD+'/'+
      costHeadId + '/'+ API.CATEGORY  +'/'+ subCategoryId +'/' + API.WORKITEM ;

    return this.httpDelegateService.getAPI(url);
  }

  activateWorkItem(baseUrl : string, costHeadId : number, subCategoryId : number, workItemId : number) {
    var url =  baseUrl +'/'+ API.COSTHEAD +'/'+
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

  updateQuantityItems( baseUrl: string, costHeadId : number, categoryId : number, workItemId : number,
                      quantityItemsArray : any) {
    var body= { item : quantityItemsArray };
    var url = baseUrl + '/'+ API.COSTHEAD +'/' + costHeadId +
      '/'+ API.CATEGORY +'/'+ categoryId +'/' + API.WORKITEM + '/' + workItemId + '/'+ API.QUANTITY;

    return this.httpDelegateService.putAPI(url, body);
  }

  updateDirectQuantityAmount( baseUrl: string, costHeadId : number, categoryId : number, workItemId : number,
                       directQuantity : number) {
    var body= { directQuantity : directQuantity };
    var url = baseUrl + '/'+ API.COSTHEAD +'/' + costHeadId +
      '/'+ API.CATEGORY +'/'+ categoryId +'/' + API.WORKITEM + '/' + workItemId + '/'+ API.DIRECT + '/'+ API.QUANTITY;

    return this.httpDelegateService.putAPI(url, body);
  }
  updateQuantityDetails(baseUrl: string, costHeadId : number, categoryId : number, workItemId : number,
                        quantityDetailsObj : QuantityDetails) {

    var body= {  item : quantityDetailsObj };

    var url = baseUrl + '/'+ API.COSTHEAD +'/' + costHeadId +
      '/'+ API.CATEGORY +'/'+ categoryId +'/' + API.WORKITEM + '/' + workItemId + '/'+ API.DIRECT_QUANTITY +
      '/'+ API.QUANTITY_ITEM_DETAILS;

    return this.httpDelegateService.putAPI(url, body);
  }

  deleteQuantityDetailsByName( baseUrl: string, costHeadId : number, categoryId : number, workItemId : number, quantityName:string) {
    var body= { item: { name : quantityName } };
    var url = baseUrl + '/'+ API.COSTHEAD +'/' + costHeadId +
      '/'+ API.CATEGORY +'/'+ categoryId +'/' + API.WORKITEM + '/' + workItemId + '/'+ API.QUANTITY + '/' + API.ITEM;

    return this.httpDelegateService.putAPI(url, body);
  }


  //Rate API
  updateRate( baseUrl: string, costHeadId : number,categoryId : number, workItemId : number,
              rateItemsArray : Rate) {
    var body=rateItemsArray;
    var url = baseUrl + '/' + API.RATE + '/' + API.COSTHEAD+ '/' +
      costHeadId + '/' + API.CATEGORY + '/' + categoryId + '/' + API.WORKITEM + '/' + workItemId ;

    return this.httpDelegateService.putAPI(url, body);
  }

  updateDirectRate( baseUrl: string, costHeadId : number, categoryId : number, workItemId : number,
                    directRate : number) {
    var body= { directRate : directRate };
    var url = baseUrl + '/'+ API.COSTHEAD +'/' + costHeadId +
      '/'+ API.CATEGORY +'/'+ categoryId +'/' + API.WORKITEM + '/' + workItemId + '/'+ API.DIRECT + '/'+ API.RATE;

    return this.httpDelegateService.putAPI(url, body);
  }


  getRateItems( projectId : String, buildingId : string, costheadId : number, categoryId : number, workItemId : number) {
    var url = API.PROJECT + '/' + projectId + '/' + API.BUILDING + '/' + buildingId + '/' + API.RATE + '/'+ API.COSTHEAD +'/' +
      costheadId + '/' + API.CATEGORY + '/'+categoryId + '/' + API.WORKITEM + '/'+workItemId ;

    return this.httpDelegateService.getAPI(url);
  }

  //Category API
  getCategories(baseUrl: string, costHeadId : number) {
    var url = baseUrl +'/'+ API.COSTHEAD+ '/' + costHeadId + '/' + API.CATEGORY;
    return this.httpDelegateService.getAPI(url);
  }

  getCostHeadDetails(baseUrl: string, costHeadId : number) {
    var url = baseUrl +'/'+ API.COSTHEAD+ '/' + costHeadId;
    return this.httpDelegateService.getAPI(url);
  }

  //Get All WorkItems Of Category
  getActiveWorkItemsOfCategory(baseUrl: string, costHeadId : number, categoryId : number) {
    var url = baseUrl +'/'+ API.COSTHEAD+ '/' + costHeadId + '/' + API.CATEGORY + '/' + categoryId + '/' + API.WORKITEMLIST;
    return this.httpDelegateService.getAPI(url);
}

  getRateItemsByOriginalName(baseUrl: string, originalRateItemName:string) {
    var url = baseUrl +'/'+ API.RATES+ '/' +API.RATE_ITEM;
    let body = {originalRateItemName : originalRateItemName };
    return this.httpDelegateService.putAPI(url, body);
  }

  addAttachment(baseUrl: string, costHeadId:number,categoryId:number,workItemId:number, filesToUpload: Array<File> ) {
    var url = AppSettings.API_ENDPOINT + baseUrl + '/' + API.COSTHEAD +'/' +
      costHeadId + '/' + API.CATEGORY + '/'+categoryId + '/' + API.WORKITEM + '/'+workItemId + '/'+ API.FILE;
    let body = {fileName : filesToUpload };
    return this.httpDelegateService.xhrAPIRequest(url, body);
  }
  getPresentFilesForWorkItem(baseUrl: string, costHeadId:number,categoryId:number,workItemId:number) {
    var url = baseUrl +'/' + API.COSTHEAD +'/' +
    costHeadId + '/' + API.CATEGORY + '/'+categoryId + '/' + API.WORKITEM + '/'+workItemId + '/' + API.FILE_LIST;
    return this.httpDelegateService.getAPI(url);
  }

  removeAttachment(baseUrl: string, costHeadId:number, categoryId:number, workItemId:number, assignedFileName:any) {
    var url = baseUrl +'/' + API.COSTHEAD +'/' +
      costHeadId + '/' + API.CATEGORY + '/'+categoryId + '/' + API.WORKITEM + '/'+workItemId + '/' + API.DELETE_FILE;
    let body = {assignedFileName : assignedFileName };
    return this.httpDelegateService.putAPI(url, body);
  }

  /*moveAtTop(compareIndex : number, collapseCostSummaryPanelTag :any) {
    let collapseTag = '#collapse' + compareIndex;
    $(collapseTag).ready(function () {
      var divPos = $(collapseCostSummaryPanelTag).offset().top;
      $('html, body').animate({
        scrollTop: divPos - 8
      }, 500);
    });
  }*/

  moveSelectedBuildingAtTop(compareIndex : number) {
    let collapseCostSummaryPanelTag = '#collapse-cost-summary-panel' + compareIndex;
    if($(collapseCostSummaryPanelTag).hasClass('collapsed')) {
      $('.collapse').removeClass('in');
      let collapseTag = '#collapse' + compareIndex;
      $(collapseTag).ready(function () {
        var divPos = $(collapseCostSummaryPanelTag).offset().top;
        $('html, body').animate({
          scrollTop: divPos - 8
        }, 500);
      });
    }
  }

  moveRecentBuildingAtTop(compareIndex : number) {
    let collapseCostSummaryPanelTag = '#collapse-cost-summary-panel' + compareIndex;
    $(collapseCostSummaryPanelTag).ready(function () {
        $(collapseCostSummaryPanelTag).removeClass('collapsed');
        $('.collapse').removeClass('in');
        $('#collapse'+compareIndex).addClass('in');
        let collapseTag = '#collapse' + compareIndex;
        $(collapseTag).ready(function () {
          var divPos = $(collapseCostSummaryPanelTag).offset().top;
          $('html, body').animate({
            scrollTop: divPos - 8
          }, 500);
        });
    });
  }
}
