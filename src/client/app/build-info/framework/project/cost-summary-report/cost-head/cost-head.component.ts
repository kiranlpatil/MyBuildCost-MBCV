import { Component, OnInit , OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Messages, ProjectElements, TableHeadings, Button, Label } from '../../../../../shared/constants';
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
  totalRate:number=0;
  totalQuantity:number=0;
  categoryRateAnalysisId:number;
  comapreWorkItemRateAnalysisId:number;
  quantity:number=0;
  rateFromRateAnalysis:number=0;
  unit:string='';
  showCategoryList: boolean = false;
  selectedWorkItems: Array<WorkItem>;
  deleteConfirmationCategory = ProjectElements.CATEGORY;
  deleteConfirmationWorkItem = ProjectElements.WORK_ITEM;

  private showQuantity:boolean=true;
  private showRate:boolean=true;
  private toggleQty:boolean=false;
  private toggleRate:boolean=false;
  private showWorkItemList:boolean=false;
  private compareWorkItemIndex:number=0;
  private compareCategoryIndex:number=0;
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

  private previousRateQuantity:number = 0;
  private quantityIncrement:number = 1;
  private displayRateView: string = null;


  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private messageService: MessageService, private commonService : CommonService) {
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
        this.categoryDetails[categoryIndex].amount).toFixed(2));

      for (let workItemIndex = 0; workItemIndex < this.categoryDetails[categoryIndex].workItems.length; workItemIndex++) {

        this.totalQuantityOfWorkItems = parseFloat((this.totalQuantityOfWorkItems +
          this.categoryDetails[categoryIndex].workItems[workItemIndex].quantity.total).toFixed(2));

        this.totalRateUnitOfWorkItems = parseFloat((this.totalRateUnitOfWorkItems +
          this.categoryDetails[categoryIndex].workItems[workItemIndex].rate.total).toFixed(2));

        this.totalAmountOfWorkItems = parseFloat((this.totalAmountOfWorkItems +
          (this.categoryDetails[categoryIndex].workItems[workItemIndex].quantity.total *
            this.categoryDetails[categoryIndex].workItems[workItemIndex].rate.total)).toFixed(2));

        this.categoryDetails[categoryIndex].workItems[workItemIndex].quantity.total =
          parseFloat((this.categoryDetails[categoryIndex].workItems[workItemIndex].quantity.total).toFixed(2));

        this.categoryDetails[categoryIndex].workItems[workItemIndex].amount =
          parseFloat((this.categoryDetails[categoryIndex].workItems[workItemIndex].quantity.total *
            this.categoryDetails[categoryIndex].workItems[workItemIndex].rate.total).toFixed(2));
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

  getQuantity( categoryIndex: number, workItemIndex: number, workItemId : number, workItem: WorkItem, quantityItems: any) {
    this.compareCategoryIndex = categoryIndex;
    this.toggleQty = !this.toggleQty;
    this.compareWorkItemIndex = workItemIndex;
    if (this.toggleQty === true) {
      this.toggleRate = false;
    }
    this.workItemId = workItemId;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
    this.quantityItemsArray = quantityItems;
    this.workItem = workItem;
    this.showQuantity = true;
  }

  //Rate from DB
  getRate(displayRateView : string, categoryIndex:number, workItemIndex:number, workItem : WorkItem, disableRateField : boolean ) {
    if(this.displayRateView !== displayRateView) {

      this.displayRateView = displayRateView;

      this.compareCategoryIndex = categoryIndex;
      this.toggleRate = true;
      this.workItem = workItem;
      this.workItemId = workItem.rateAnalysisId;
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
      this.compareWorkItemIndex = workItemIndex;
      this.rateItemsArray = workItem.rate;
      this.unit = workItem.rate.unit;

      if (this.quantityIncrement !== 1) {
        this.quantityIncrement = this.previousRateQuantity / this.rateItemsArray.quantity;
        this.rateItemsArray.quantity = this.previousRateQuantity;
        for (let rateItemsIndex = 0; rateItemsIndex < this.rateItemsArray.rateItems.length; rateItemsIndex++) {
          this.rateItemsArray.rateItems[rateItemsIndex].quantity = parseFloat((this.rateItemsArray.rateItems[rateItemsIndex].quantity *
            this.quantityIncrement).toFixed(2));
        }
      }

      this.calculateTotal();
      this.disableRateField=disableRateField;
    }

  }

  //Rate from DB by Quantity
  getRateByQuantity(displayRateView : string, categoryIndex:number, workItemIndex:number, workItem : WorkItem,
                    disableRateField : boolean ) {
    if(this.displayRateView !== displayRateView) {

      this.displayRateView = displayRateView;

      this.compareCategoryIndex = categoryIndex;
      this.workItemId = workItem.rateAnalysisId;
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
      this.compareWorkItemIndex = workItemIndex;
      this.rateItemsArray = workItem.rate;
      this.unit = workItem.rate.unit;

      this.previousRateQuantity = this.rateItemsArray.quantity;
      this.rateItemsArray.quantity = workItem.quantity.total;
      this.quantityIncrement = this.rateItemsArray.quantity / this.previousRateQuantity;
      for (let rateItemsIndex = 0; rateItemsIndex < this.rateItemsArray.rateItems.length; rateItemsIndex++) {
        this.rateItemsArray.rateItems[rateItemsIndex].quantity = parseFloat((this.rateItemsArray.rateItems[rateItemsIndex].quantity *
          this.quantityIncrement).toFixed(2));
      }

      this.calculateTotal();
      this.disableRateField=disableRateField;
    }
  }

  //System Rate from DB
  getSystemRate(displayRateView : string, categoryIndex:number, workItemIndex:number, workItem : WorkItem, disableRateField : boolean ) {
if(this.displayRateView !== displayRateView || this.compareCategoryIndex !==categoryIndex || this.compareWorkItemIndex !== workItemIndex) {
      this.displayRateView = displayRateView;

      this.compareCategoryIndex = categoryIndex;
      this.toggleRate = true;
      this.workItem = workItem;
      this.workItemId = workItem.rateAnalysisId;
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
      this.compareWorkItemIndex = workItemIndex;
      this.rateItemsArray = workItem.systemRate;
      this.unit = workItem.systemRate.unit;

      this.calculateTotal();
      this.disableRateField=disableRateField;
    }

  }

  calculateTotal() {
    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;
    this.rateItemsArray.total=0;

    for(let rateItemsIndex=0; rateItemsIndex < this.rateItemsArray.rateItems.length; rateItemsIndex++) {
      this.totalAmount = parseFloat((this.totalAmount + ( this.rateItemsArray.rateItems[rateItemsIndex].quantity *
        this.rateItemsArray.rateItems[rateItemsIndex].rate )).toFixed(2));
      this.totalRate = parseFloat((this.totalRate + this.rateItemsArray.rateItems[rateItemsIndex].rate).toFixed(2));
      this.totalQuantity = parseFloat((this.totalQuantity + this.rateItemsArray.rateItems[rateItemsIndex].quantity).toFixed(2));
    }

    this.rateItemsArray.total= parseFloat((this.totalAmount/this.rateItemsArray.quantity).toFixed(2));

    this.showRate = true;

    this.toggleRate = true;

    if (this.toggleRate === true) {
      this.toggleQty = false;
    }
  }

  setIdsForDeleteWorkItem(categoryId: string, workItemId: string) {
    this.categoryId = parseInt(categoryId);
    this.workItemId =  parseInt(workItemId);
  }

  inActiveWorkItem() {
  let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
  let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
  let costHeadId=parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
  this.costSummaryService.inActiveWorkItem( projectId, buildingId, costHeadId, this.categoryId, this.workItemId ).subscribe(
    costHeadDetail => this.onInActiveWorkItemSuccess(costHeadDetail),
  error => this.onInActiveWorkItemFailure(error)
);
}

  onInActiveWorkItemSuccess(deleteWorkItem: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_COSTHEAD_WORKITEM;
    this.messageService.message(message);
    this.getActiveCategories( this.projectId, this.costHeadId);
  }

  onInActiveWorkItemFailure(error: any) {
    console.log('InActive WorkItem error : '+JSON.stringify(error));
  }

  getWorkItemList( categoryId:number, workItemIndex:number) {
    this.comapreWorkItemRateAnalysisId = workItemIndex;
    this.categoryRateAnalysisId = categoryId;

    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.costSummaryService.getWorkItemList( projectId, buildingId, this.costHeadId, categoryId).subscribe(
      workItemList => this.onGetWorkItemListSuccess(workItemList),
      error => this.onGetWorkItemListFailure(error)
    );
  }

  onGetWorkItemListSuccess(workItemList:any) {
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

  onGetWorkItemListFailure(error:any) {
    console.log('Get WorkItemList error : '+error);
  }

  onChangeAddSelectedWorkItem(selectedWorkItem:any) {
    this.showWorkItemList=false;
    let workItemList  =  this.workItemListArray;
    let workItemObject = workItemList.filter(
      function( workItemObj: any){
        return workItemObj.name === selectedWorkItem;
      });
    let categoryId=this.categoryRateAnalysisId;
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.activeWorkItem( projectId, buildingId, this.costHeadId, categoryId, workItemObject[0].rateAnalysisId).subscribe(
      workItemList => this.onActiveWorkItemSuccess(workItemList),
      error => this.onActiveWorkItemFailure(error)
    );
  }

  onActiveWorkItemSuccess(workItemList:any) {
    this.selectedWorkItems=workItemList.data;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_WORKITEM;
    this.messageService.message(message);
    this.showWorkItemList=false;
    this.getActiveCategories(this.projectId, this.costHeadId);
  }

  onActiveWorkItemFailure(error:any) {
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
    this.showQuantity = false;
    this.showRate = false;
  }

  setSelectedWorkItems(workItemList:any) {
    this.selectedWorkItems = workItemList;
  }

  deleteElement(elementType : string) {
    if(elementType === ProjectElements.CATEGORY) {
      this.deactivateCategory();
    }
    if(elementType === ProjectElements.WORK_ITEM) {
      this.inActiveWorkItem();
    }
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
