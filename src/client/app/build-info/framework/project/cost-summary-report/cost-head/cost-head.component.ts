import { Component, OnInit , OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Messages, ProjectElements, NavigationRoutes, TableHeadings, Button, Label, ValueConstant } from '../../../../../shared/constants';
import { API,SessionStorage, SessionStorageService, Message, MessageService } from '../../../../../shared/index';
import { Rate } from '../../../model/rate';
import { CommonService } from '../../../../../shared/services/common.service';
import { CostSummaryService } from '../cost-summary.service';
import * as lodsh from 'lodash';
import { Category } from '../../../model/category';
import { WorkItem } from '../../../model/work-item';
import { QuantityItem } from '../../../model/quantity-item';
import { LoaderService } from '../../../../../shared/loader/loaders.service';


@Component({
  moduleId: module.id,
  selector: 'bi-cost-head',
  styleUrls: ['cost-head.component.css'],
  templateUrl: 'cost-head.component.html'
})

export class CostHeadComponent implements OnInit, OnChanges {
  projectId : string;
  viewTypeValue: string;
  baseUrl:string;
  viewType:string;
  costHeadName: string;
  costHeadId:number;
  workItemId: number;
  categoryId: number;
  categoryDetails: Array<Category>;
  categoryDetailsTotalAmount: number=0;
  workItem: WorkItem;
  totalAmount:number=0;
  categoryRateAnalysisId:number;
  compareWorkItemRateAnalysisId:number;
  quantity:number=0;
  rateFromRateAnalysis:number=0;
  unit:string='';
  showCategoryList: boolean = false;
  selectedWorkItems: Array<WorkItem>;
  deleteConfirmationCategory = ProjectElements.CATEGORY;
  deleteConfirmationWorkItem = ProjectElements.WORK_ITEM;

  private showWorkItemList:boolean=false;
  private showWorkItemTab : string = null;
  private compareWorkItemId:number=0;
  private compareCategoryId:number=0;
  private quantityItemsArray: QuantityItem;
  private rateItemsArray: Rate;
  private categoryArray : Array<Category> = [];

  private workItemListArray: Array<WorkItem> = [];
  private categoryListArray : Array<Category> = [];
  private categoryIdForInActive: number;
  private currentCategoryIndex: number;
  private currentWorkItemIndex: number;

  private disableRateField:boolean = false;
  private rateView : string;
  private previousRateQuantity:number = 0;
  private quantityIncrement:number = 1;
  private displayRateView: string = null;

  private selectedWorkItemData : Array<WorkItem> = [];


  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private _router: Router, private messageService: MessageService, private commonService : CommonService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {

      this.projectId = params['projectId'];
      this.viewType = params['viewType'];
      this.viewTypeValue = params['viewTypeValue'];
      this.costHeadName = params['costHeadName'];
      this.costHeadId = parseInt(params['costHeadId']);


      if(this.viewType ===  API.BUILDING ) {
        let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
        this.baseUrl = '' +API.PROJECT + '/' + this.projectId + '/' + '' +  API.BUILDING+ '/' + buildingId;
      } else if(this.viewType === API.COMMON_AMENITIES) {
        this.baseUrl = '' +API.PROJECT + '/' + this.projectId;
      } else {
        console.log('Error');
      }

   SessionStorageService.setSessionValue(SessionStorage.CURRENT_COST_HEAD_ID, this.costHeadId);
      this.getCategories( this.projectId, this.costHeadId);

    });
  }

  getCategories(projectId: string, costHeadId: number) {

    this.costSummaryService.getCategories(this.baseUrl, costHeadId).subscribe(
      categoryDetails => this.onGetCategoriesSuccess(categoryDetails),
      error => this.onGetCategoriesFailure(error)
    );
  }

  onGetCategoriesSuccess(categoryDetails: any) {
    this.categoryDetails = categoryDetails.data;
    this.calculateCategoriesTotal();
  }

  calculateCategoriesTotal() {

    this.categoryDetailsTotalAmount = 0.0;

    for (let categoryData of this.categoryDetails) {

      categoryData.amount = 0.0;

      for (let workItemData of categoryData.workItems) {

        workItemData.amount = parseFloat(( workItemData.quantity.total * workItemData.rate.total).toFixed(
          ValueConstant.NUMBER_OF_FRACTION_DIGIT));

        categoryData.amount = parseFloat(( categoryData.amount +  workItemData.amount).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

      }

      this.categoryDetailsTotalAmount = parseFloat(( this.categoryDetailsTotalAmount + categoryData.amount).toFixed(
        ValueConstant.NUMBER_OF_FRACTION_DIGIT));
    }
    this.loaderService.stop();
  }

  onGetCategoriesFailure(error: any) {
    console.log(error);
    this.loaderService.stop();
  }

  ngOnChanges(changes: any) {
    if (changes.categoryListArray.currentValue !== undefined) {
      this.categoryListArray = changes.categoryListArray.currentValue;
    }
  }

  getQuantity( categoryId: number, workItemId : number, workItem: WorkItem,
               quantityItems: any, categoryIndex: number, workItemIndex:number) {
    if( this.showWorkItemTab !== Label.WORKITEM_QUANTITY_TAB || this.compareCategoryId !== categoryId ||
      this.compareWorkItemId !== workItemId) {

      this.setItemId(categoryId, workItemId);

      this.workItemId = workItemId;
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);

      this.quantityItemsArray = quantityItems;
      this.workItem = workItem;
      this.rateView = 'quantity';
      this.currentCategoryIndex = categoryIndex;
      this.currentWorkItemIndex = workItemIndex;
      this.showWorkItemTab = Label.WORKITEM_QUANTITY_TAB;
    } else {
      this.showWorkItemTab = null;
    }
  }

  // Get Rate
  getRate(displayRateView : string, categoryId:number, workItemId:number, workItem : WorkItem, disableRateField : boolean,
          categoryIndex : number, workItemIndex : number ) {
    if(this.showWorkItemTab !== Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {

      this.setItemId(categoryId, workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.rate);
      this.calculateTotalForRateView();
      this.currentCategoryIndex = categoryIndex;
      this.currentWorkItemIndex = workItemIndex;
      this.rateView = 'rate';
      this.setRateFlags(displayRateView, disableRateField);
    } else {
      this.showWorkItemTab = null;
      this.displayRateView = null;
    }
  }

  // Get Rate by quantity
  getRateByQuantity(displayRateView : string, categoryId:number, workItemId:number, workItem : WorkItem,
                    disableRateField : boolean , categoryIndex:number, workItemIndex : number) {
    if(this.showWorkItemTab !== Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {

      this.setItemId(categoryId, workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.rate);
      this.calculateQuantity(workItem);
      this.calculateTotalForRateView();
      this.setRateFlags(displayRateView, disableRateField);
      this.rateView = 'cost';
      this.currentCategoryIndex = categoryIndex;
      this.currentWorkItemIndex = workItemIndex;
    } else {
      this.showWorkItemTab = null;
      this.displayRateView = null;
    }
  }

  // Get System rate
  getSystemRate(displayRateView : string, categoryId:number, workItemId:number, workItem : WorkItem,
                disableRateField : boolean, categoryIndex:number, workItemIndex : number) {
    if(this.showWorkItemTab !== Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {

      this.setItemId(categoryId, workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.systemRate);
      this.calculateTotalForRateView();
      this.rateView = 'systemRA';
      this.currentCategoryIndex = categoryIndex;
      this.currentWorkItemIndex = workItemIndex;
      this.setRateFlags(displayRateView, disableRateField);
    } else {
      this.showWorkItemTab = null;
      this.displayRateView = null;
    }
  }

  setItemId(categoryId:number, workItemId:number) {
    this.compareCategoryId = categoryId;
    this.compareWorkItemId = workItemId;
  }

  setRateFlags(displayRateView : string, disableRateField : boolean) {
    this.displayRateView = displayRateView;
    this.disableRateField=disableRateField;
    this.showWorkItemTab = Label.WORKITEM_RATE_TAB;
  }

  setWorkItemDataForRateView(workItemId : number, rate : Rate) {
    this.workItemId = workItemId;
      this.rateItemsArray = lodsh.cloneDeep(rate);
      this.unit = lodsh.cloneDeep(rate.unit);
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
  }

  calculateQuantity(workItem : WorkItem) {
    this.previousRateQuantity = lodsh.cloneDeep(workItem.rate.quantity);
    this.rateItemsArray.quantity = lodsh.cloneDeep(workItem.quantity.total);
    this.quantityIncrement = this.rateItemsArray.quantity / this.previousRateQuantity;
    for (let rateItemsIndex = 0; rateItemsIndex < this.rateItemsArray.rateItems.length; rateItemsIndex++) {
      this.rateItemsArray.rateItems[rateItemsIndex].quantity = parseFloat((
        this.rateItemsArray.rateItems[rateItemsIndex].quantity *
        this.quantityIncrement).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
    }
  }

  calculateTotalForRateView() {
    this.totalAmount=0;
    this.rateItemsArray.total=0;

    for(let rateItemsIndex=0; rateItemsIndex < this.rateItemsArray.rateItems.length; rateItemsIndex++) {

      this.rateItemsArray.rateItems[rateItemsIndex].totalAmount = parseFloat((this.rateItemsArray.rateItems[rateItemsIndex].quantity*
        this.rateItemsArray.rateItems[rateItemsIndex].rate).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

      this.totalAmount = parseFloat((this.totalAmount + this.rateItemsArray.rateItems[rateItemsIndex].totalAmount
      ).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
     }

    this.rateItemsArray.total= parseFloat((this.totalAmount/this.rateItemsArray.quantity).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
  }

  setIdsForDeleteWorkItem(categoryId: string, workItemId: string,workItemIndex:number) {
    this.categoryId = parseInt(categoryId);
    this.workItemId =  parseInt(workItemId);
    this.compareWorkItemId = workItemIndex;
  }

  deactivateWorkItem() {
    this.loaderService.start();
    let costHeadId=parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
    this.costSummaryService.deactivateWorkItem( this.baseUrl, costHeadId, this.categoryId, this.workItemId ).subscribe(
        success => this.onDeActivateWorkItemSuccess(success),
      error => this.onDeActivateWorkItemFailure(error)
    );
  }

  onDeActivateWorkItemSuccess(success: string) {

    this.showWorkItemList = false;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_WORKITEM;
    this.messageService.message(message);

    for(let category of this.categoryDetails) {
      if(category.rateAnalysisId === this.categoryId) {
        for(let workItem of category.workItems) {
          if(workItem.rateAnalysisId === this.workItemId) {
            category.workItems = category.workItems.filter(item => item !== workItem);
          }
        }
      }
    }

    this.calculateCategoriesTotal();
  }

  onDeActivateWorkItemFailure(error: any) {
    console.log('InActive WorkItem error : '+JSON.stringify(error));
    this.loaderService.stop();
  }

  getInActiveWorkItems(categoryId:number, workItemIndex:number) {

    this.compareWorkItemRateAnalysisId = workItemIndex;
    this.categoryRateAnalysisId = categoryId;

    this.costSummaryService.getInActiveWorkItems( this.baseUrl, this.costHeadId, categoryId).subscribe(
      workItemList => this.onGetInActiveWorkItemsSuccess(workItemList),
      error => this.onGetInActiveWorkItemsFailure(error)
    );
  }

  onGetInActiveWorkItemsSuccess(workItemList:any) {
    if (workItemList.data.length !== 0) {
      this.workItemListArray = workItemList.data;
      this.showWorkItemList = true;
    } else {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_ALREADY_ADDED_ALL_WORKITEMS;
      this.messageService.message(message);
    }
  }

  onGetInActiveWorkItemsFailure(error:any) {
    console.log('Get WorkItemList error : '+error);
  }

  onChangeActivateSelectedWorkItem(selectedWorkItem:any) {
    this.loaderService.start();
    this.showWorkItemList=false;
    let workItemList  =  this.workItemListArray;
    let workItemObject = workItemList.filter(
      function( workItemObj: any){
        return workItemObj.name === selectedWorkItem;
      });

    this.selectedWorkItemData[0] = workItemObject[0];

    let categoryId=this.categoryRateAnalysisId;

    this.costSummaryService.activateWorkItem( this.baseUrl, this.costHeadId, categoryId,
      workItemObject[0].rateAnalysisId).subscribe(
      success => this.onActivateWorkItemSuccess(success),
      error => this.onActivateWorkItemFailure(error)
    );
  }

  onActivateWorkItemSuccess(success : string) {

    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_WORKITEM;
    this.messageService.message(message);

    for(let category of this.categoryDetails) {
      if(category.rateAnalysisId === this. categoryRateAnalysisId) {
            category.workItems = category.workItems.concat(this.selectedWorkItemData);
        }
    }

    this.calculateCategoriesTotal();
  }

  onActivateWorkItemFailure(error:any) {
    console.log('Active WorkItem error : '+error);
    this.loaderService.stop();
  }

  setCategoryIdForDeactivate(categoryId : any) {
    this.categoryIdForInActive = categoryId;
  }

/*  deactivateCategory() {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.deactivateCategory( projectId, buildingId, this.costHeadId, this.categoryIdForInActive).subscribe(
      deactivatedCategory => this.onDeactivateCategorySuccess(deactivatedCategory),
      error => this.onDeactivateCategoryFailure(error)
    );
  }

  onDeactivateCategorySuccess(deactivatedCategory : any) {
    let categoryList = lodsh.clone(this.categoryDetails);
    this.categoryDetails = this.commonService.removeDuplicateItmes(categoryList, deactivatedCategory.data);
    this.calculateCategoriesTotal();
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_CATEGORY;
    this.messageService.message(message);
/!*    this.getCategories( this.projectId, this.costHeadId);*!/
  }

  onDeactivateCategoryFailure(error : any) {
    console.log('In Active Category error : '+JSON.stringify(error));
  }*/

 /* getInActiveCategories() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.getInActiveCategories( projectId, buildingId, this.costHeadId).subscribe(
      categoryList => this.onGetInActiveCategoriesSuccess(categoryList),
      error => this.onGetInActiveCategoriesFailure(error)
    );
  }

  onGetInActiveCategoriesSuccess(categoryList : any) {
    if(categoryList.data.length!==0) {
    this.categoryArray = categoryList.data;
    this.showCategoryList = true;
    } else {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_ALREADY_ADDED_ALL_CATEGORIES;
      this.messageService.message(message);
    }
  }

  onGetInActiveCategoriesFailure(error : any) {
    console.log('categoryList error : '+JSON.stringify(error));
  }*/

  /*onChangeActivateSelectedCategory(selectedCategoryId : number ) {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.activateCategory( projectId, buildingId, this.costHeadId, selectedCategoryId).subscribe(
      building => this.onActivateCategorySuccess(building),
      error => this.onActivateCategoryFailure(error)
    );
  }

  onActivateCategorySuccess(activatedCategory : any) {
    this.categoryDetails = this.categoryDetails.concat(activatedCategory.data);
    this.calculateCategoriesTotal();

    let categoryList = lodsh.clone(this.categoryArray);
    this.categoryArray = this.commonService.removeDuplicateItmes(categoryList, this.categoryDetails);

    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_CATEGORY;
    this.messageService.message(message);
  }

  onActivateCategoryFailure(error : any) {
    console.log('building error : '+ JSON.stringify(error));
  }
*/
  refreshCategoryList() {
    this.getCategories( this.projectId, this.costHeadId);
    this.showWorkItemTab = null;
    this.displayRateView = null;
  }

  setSelectedWorkItems(workItemList:any) {
    this.selectedWorkItems = workItemList;
  }

  deleteElement(elementType : string) {
   /* if(elementType === ProjectElements.CATEGORY) {
      this.deactivateCategory();
    }*/
    if(elementType === ProjectElements.WORK_ITEM) {
      this.deactivateWorkItem();
    }
  }

  goBack() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this._router.navigate([NavigationRoutes.APP_PROJECT,projectId,NavigationRoutes.APP_COST_SUMMARY]);
  }

  getTableHeadings() {
    return TableHeadings;
  }

  getButton() {
    return Button;
  }

  getLabel() {
    return Label;
  }

}
