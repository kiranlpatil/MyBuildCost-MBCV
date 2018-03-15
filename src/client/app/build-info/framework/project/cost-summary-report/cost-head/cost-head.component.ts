import { Component, OnInit , OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Messages, ProjectElements, NavigationRoutes, TableHeadings, Button, Label, ValueConstant } from '../../../../../shared/constants';
import { SessionStorage, SessionStorageService, Message, MessageService } from '../../../../../shared/index';
import { Rate } from '../../../model/rate';
import { CommonService } from '../../../../../shared/services/common.service';
import { CostSummaryService } from '../cost-summary.service';
import * as lodsh from 'lodash';
import { Category } from '../../../model/category';
import { WorkItem } from '../../../model/work-item';
import { QuantityItem } from '../../../model/quantity-item';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head',
  styleUrls: ['cost-head.component.css'],
  templateUrl: 'cost-head.component.html'
})

export class CostHeadComponent implements OnInit, OnChanges {
  projectId : string;
  buildingName: string;
  costHead: string;
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

  private totalQuantityOfWorkItems:number=0;
  private totalRateUnitOfWorkItems:number=0;
  private totalAmountOfWorkItems:number=0;

  private disableRateField:boolean = false;
  private rateView : string;
  private previousRateQuantity:number = 0;
  private quantityIncrement:number = 1;
  private displayRateView: string = null;


  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private _router: Router, private messageService: MessageService, private commonService : CommonService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.buildingName = params['buildingName'];
      this.costHead = params['costHeadName'];
      let costheadIdParams = params['costHeadId'];
      this.costHeadId = parseInt(costheadIdParams);
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_COST_HEAD_ID,this.costHeadId);
      this.getActiveCategories( this.projectId, this.costHeadId);
    });
  }

  getActiveCategories(projectId: string, costHeadId: number) {
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.costSummaryService.getActiveCategories( projectId, buildingId, costHeadId).subscribe(
      categoryDetails => this.onGetActiveCategoriesSuccess(categoryDetails),
      error => this.onGetActiveCategoriesFalure(error)
    );
  }

  onGetActiveCategoriesSuccess(categoryDetails: any) {
    this.categoryDetails = categoryDetails.data;
    this.calculateCategoriesTotal();
    let categoryList = lodsh.clone(this.categoryArray);
    this.categoryArray = this.commonService.removeDuplicateItmes(categoryList, this.categoryDetails);
  }

  calculateCategoriesTotal() {
    this.categoryDetailsTotalAmount = 0.0;
    this.totalQuantityOfWorkItems = 0.0;
    this.totalRateUnitOfWorkItems = 0.0;
    this.totalAmountOfWorkItems = 0.0;

    for (let categoryIndex = 0; categoryIndex < this.categoryDetails.length; categoryIndex++) {

      this.categoryDetailsTotalAmount = parseFloat((this.categoryDetailsTotalAmount +
        this.categoryDetails[categoryIndex].amount).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

      for (let workItemIndex = 0; workItemIndex < this.categoryDetails[categoryIndex].workItems.length; workItemIndex++) {

        this.totalQuantityOfWorkItems = parseFloat((this.totalQuantityOfWorkItems +
          this.categoryDetails[categoryIndex].workItems[workItemIndex].quantity.total).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

        this.totalRateUnitOfWorkItems = parseFloat((this.totalRateUnitOfWorkItems +
          this.categoryDetails[categoryIndex].workItems[workItemIndex].rate.total).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

        this.totalAmountOfWorkItems = parseFloat((this.totalAmountOfWorkItems +
          (this.categoryDetails[categoryIndex].workItems[workItemIndex].quantity.total *
            this.categoryDetails[categoryIndex].workItems[workItemIndex].rate.total)).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

        this.categoryDetails[categoryIndex].workItems[workItemIndex].quantity.total = parseFloat((
          this.categoryDetails[categoryIndex].workItems[workItemIndex].quantity.total).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

        this.categoryDetails[categoryIndex].workItems[workItemIndex].amount =
          parseFloat((this.categoryDetails[categoryIndex].workItems[workItemIndex].quantity.total *
            this.categoryDetails[categoryIndex].workItems[workItemIndex].rate.total).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
      }
    }
  }

  onGetActiveCategoriesFalure(error: any) {
    console.log(error);
  }

  ngOnChanges(changes: any) {
    if (changes.categoryListArray.currentValue !== undefined) {
      this.categoryListArray = changes.categoryListArray.currentValue;
    }
  }

  getQuantity( categoryId: number, workItemId : number, workItem: WorkItem, quantityItems: any) {
    if( this.showWorkItemTab !== Label.WORKITEM_QUANTITY_TAB || this.compareCategoryId !== categoryId ||
      this.compareWorkItemId !== workItemId) {

      this.compareCategoryId = categoryId;
      this.compareWorkItemId = workItemId;
      this.workItemId = workItemId;
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
      this.quantityItemsArray = quantityItems;
      this.workItem = workItem;
      this.showWorkItemTab = Label.WORKITEM_QUANTITY_TAB;
    } else {
      this.showWorkItemTab = null;
    }
  }

  // Get Rate
  getRate(displayRateView : string, categoryId:number, workItemId:number, workItem : WorkItem, disableRateField : boolean ) {
    if(this.showWorkItemTab !== Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {

      this.setItemId(categoryId, workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.rate);
      this.calculateTotalForRateView();
      this.rateView = 'rate';
      this.setRateFlags(displayRateView, disableRateField);
    } else {
      this.showWorkItemTab = null;
      this.displayRateView = null;
    }
  }

  // Get Rate by quantity
  getRateByQuantity(displayRateView : string, categoryId:number, workItemId:number, workItem : WorkItem, disableRateField : boolean ) {
    if(this.showWorkItemTab !== Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {

      this.setItemId(categoryId, workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.rate);
      this.calculateQuantity(workItem);
      this.calculateTotalForRateView();
      this.setRateFlags(displayRateView, disableRateField);
      this.rateView = 'cost';
    } else {
      this.showWorkItemTab = null;
      this.displayRateView = null;
    }
  }

  // Get System rate
  getSystemRate(displayRateView : string, categoryId:number, workItemId:number, workItem : WorkItem, disableRateField : boolean ) {
    if(this.showWorkItemTab !== Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {

      this.setItemId(categoryId, workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.systemRate);
      this.calculateTotalForRateView();
      this.rateView = 'systemRA';
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
      this.totalAmount = parseFloat((this.totalAmount + ( this.rateItemsArray.rateItems[rateItemsIndex].quantity *
        this.rateItemsArray.rateItems[rateItemsIndex].rate )).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
     }

    this.rateItemsArray.total= parseFloat((this.totalAmount/this.rateItemsArray.quantity).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
  }

  setIdsForDeleteWorkItem(categoryId: string, workItemId: string,workItemIndex:number) {
    this.categoryId = parseInt(categoryId);
    this.workItemId =  parseInt(workItemId);
    this.compareWorkItemId = workItemIndex;
  }

  deactivateWorkItem() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let costHeadId=parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
      this.costSummaryService.deactivateWorkItem( projectId, buildingId, costHeadId, this.categoryId, this.workItemId ).subscribe(
        workItemDetails => this.onDeActivateWorkItemSuccess(workItemDetails),
      error => this.onDeActivateWorkItemFailure(error)
    );
  }

  onDeActivateWorkItemSuccess(workItemDetails: any) {
    let inActiveWorkItems: Array<WorkItem> = workItemDetails.data;
    for(let inActiveWorkItemsIndex = 0; inActiveWorkItemsIndex<inActiveWorkItems.length; inActiveWorkItemsIndex++) {
      if(inActiveWorkItemsIndex === this.compareWorkItemId) {
        inActiveWorkItems.splice(inActiveWorkItemsIndex,1);
      }
    }
    this.workItemListArray = inActiveWorkItems;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_WORKITEM;
    this.messageService.message(message);
    this.getActiveCategories( this.projectId, this.costHeadId);
  }
  onDeActivateWorkItemFailure(error: any) {
    console.log('InActive WorkItem error : '+JSON.stringify(error));
  }

  getInActiveWorkItems(categoryId:number, workItemIndex:number) {
    this.compareWorkItemRateAnalysisId = workItemIndex;
    this.categoryRateAnalysisId = categoryId;

    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.costSummaryService.getInActiveWorkItems( projectId, buildingId, this.costHeadId, categoryId).subscribe(
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
    this.showWorkItemList=false;
    let workItemList  =  this.workItemListArray;
    let workItemObject = workItemList.filter(
      function( workItemObj: any){
        return workItemObj.name === selectedWorkItem;
      });
    let categoryId=this.categoryRateAnalysisId;
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.activateWorkItem( projectId, buildingId, this.costHeadId, categoryId,
      workItemObject[0].rateAnalysisId).subscribe(
      workItemList => this.onActivateWorkItemSuccess(workItemList),
      error => this.onActivateWorkItemFailure(error)
    );
  }

  onActivateWorkItemSuccess(workItemList:any) {
    this.selectedWorkItems=workItemList.data;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_WORKITEM;
    this.messageService.message(message);
    this.showWorkItemList=false;
    this.getActiveCategories(this.projectId, this.costHeadId);
  }

  onActivateWorkItemFailure(error:any) {
    console.log('Active WorkItem error : '+error);
  }

  setCategoryIdForDeactivate(categoryId : any) {
    this.categoryIdForInActive = categoryId;
  }

  deactivateCategory() {
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
/*    this.getActiveCategories( this.projectId, this.costHeadId);*/
  }

  onDeactivateCategoryFailure(error : any) {
    console.log('In Active Category error : '+JSON.stringify(error));
  }

  getInActiveCategories() {
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
  }

  onChangeActivateSelectedCategory(selectedCategoryId : number ) {
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

  refreshCategoryList() {
    this.getActiveCategories( this.projectId, this.costHeadId);
    this.showWorkItemTab = null;
    this.displayRateView = null;
  }

  setSelectedWorkItems(workItemList:any) {
    this.selectedWorkItems = workItemList;
  }

  deleteElement(elementType : string) {
    if(elementType === ProjectElements.CATEGORY) {
      this.deactivateCategory();
    }
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
