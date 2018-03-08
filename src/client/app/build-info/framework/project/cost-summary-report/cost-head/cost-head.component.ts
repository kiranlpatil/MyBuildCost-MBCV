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
      this.getCategory( this.projectId, this.costHeadId);
    });
  }

  getCategory(projectId: string, costHeadId: number) {
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.costSummaryService.getCategory( projectId, buildingId, costHeadId).subscribe(
      categoryDetails => this.onGetCategorySuccess(categoryDetails),
      error => this.onGetCategoryFailure(error)
    );
  }

  onGetCategorySuccess(categoryDetails: any) {
    this.categoryDetails = categoryDetails.data;
    this.categoryDetailsTotalAmount=0.0;
    this.totalQuantityOfWorkItems=0.0;
    this.totalRateUnitOfWorkItems=0.0;
    this.totalAmountOfWorkItems=0.0;

    for(let categoryIndex=0; categoryIndex < this.categoryDetails.length; categoryIndex++) {

      this.categoryDetailsTotalAmount = parseFloat(( this.categoryDetailsTotalAmount +
        this.categoryDetails[categoryIndex].amount).toFixed(2));

      for(let workItemIdex=0; workItemIdex < this.categoryDetails[categoryIndex].workItems.length; workItemIdex++) {

        this.totalQuantityOfWorkItems = parseFloat((this.totalQuantityOfWorkItems +
          this.categoryDetails[categoryIndex].workItems[workItemIdex].quantity.total).toFixed(2));

        this.totalRateUnitOfWorkItems = parseFloat((this.totalRateUnitOfWorkItems +
          this.categoryDetails[categoryIndex].workItems[workItemIdex].rate.total).toFixed(2));

        this.totalAmountOfWorkItems = parseFloat((this.totalAmountOfWorkItems +
          (this.categoryDetails[categoryIndex].workItems[workItemIdex].quantity.total *
          this.categoryDetails[categoryIndex].workItems[workItemIdex].rate.total)).toFixed(2));

        this.categoryDetails[categoryIndex].workItems[workItemIdex].quantity.total =
          parseFloat((this.categoryDetails[categoryIndex].workItems[workItemIdex].quantity.total).toFixed(2));

        this.categoryDetails[categoryIndex].workItems[workItemIdex].amount=
          parseFloat((this.categoryDetails[categoryIndex].workItems[workItemIdex].quantity.total *
            this.categoryDetails[categoryIndex].workItems[workItemIdex].rate.total).toFixed(2));
      }
    }

    let categoryList = lodsh.clone(this.categoryArray);
    this.categoryArray = this.commonService.removeDuplicateItmes(categoryList, this.categoryDetails);
  }

  onGetCategoryFailure(error: any) {
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

  getRateFromRateAnalysis( categoryIndex:number, workItemIndex: number, workItem:WorkItem) {
    this.compareCategoryIndex = categoryIndex;
    this.toggleRate = !this.toggleRate;
    this.compareWorkItemIndex = workItemIndex;
    if (this.toggleRate === true) {
      this.toggleQty = false;
    }
    this.workItem = workItem;
    this.workItemId = workItem.rateAnalysisId;

    SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
    let categoryId=this.categoryDetails[categoryIndex].rateAnalysisId;
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.getRateItems( projectId, buildingId, this.costHeadId, categoryId, this.workItemId).subscribe(
      rateItem => {
        this.onGetRateItemsSuccess(workItem, rateItem);
      },error => this.onGetRateItemsFailure(error)
    );
  }

  onGetRateItemsSuccess(workItem:any, rateItem: any) {
    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;

    this.rateItemsArray=rateItem.data;
    this.workItem = workItem;

    this.rateFromRateAnalysis = rateItem.data.rateFromRateAnalysis;

    this.workItem.rate.rateFromRateAnalysis=rateItem.data.rateFromRateAnalysis;

    this.rateItemsArray.quantity=rateItem.data.quantity;

    this.rateItemsArray.unit=rateItem.data.unit;
    this.unit=rateItem.data.unit;
    this.quantity=rateItem.data.quantity;

    this.unit=rateItem.data.unit;
    this.rateItemsArray = rateItem.data;

    for(let i=0;i<rateItem.data.rateItems.length;i++) {
      this.totalAmount=parseFloat((this.totalAmount+( rateItem.data.rateItems[i].quantity*
        rateItem.data.rateItems[i].rate)).toFixed(2));
      this.totalRate=parseFloat((this.totalRate+rateItem.data.rateItems[i].rate).toFixed(2));
      this.totalQuantity=parseFloat((this.totalQuantity+rateItem.data.rateItems[i].quantity).toFixed(2));
    }
    this.rateItemsArray.total= parseFloat((this.totalAmount/this.totalQuantity).toFixed(2));
    this.showRate = true;
  }

  onGetRateItemsFailure(error: any) {
    console.log(error);
  }

  //Rate from DB
  getRateFromDatabase( i:number, workItemIndex:number, workItem : WorkItem) {
    this.compareCategoryIndex=i;
    this.toggleRate = !this.toggleRate;
    this.workItem = workItem;
    this.workItemId = workItem.rateAnalysisId;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
    this.compareWorkItemIndex = workItemIndex;
    if (this.toggleRate === true) {
      this.toggleQty = false;
    }
    this.rateItemsArray=workItem.rate;
    let rate = new Rate();
    rate.rateItems = workItem.rate.rateItems;
    rate.rateFromRateAnalysis = workItem.rate.rateFromRateAnalysis ;
    rate.total = workItem.rate.total;
    rate.unit = workItem.rate.unit;
    rate.quantity = workItem.rate.quantity;
    this.unit=workItem.rate.unit;
    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;

    for(let i=0; i < this.rateItemsArray.rateItems.length; i++) {
      this.totalAmount = parseFloat((this.totalAmount + ( this.rateItemsArray.rateItems[i].quantity *
        this.rateItemsArray.rateItems[i].rate )).toFixed(2));
      this.totalRate = parseFloat((this.totalRate + this.rateItemsArray.rateItems[i].rate).toFixed(2));
      this.totalQuantity = parseFloat((this.totalQuantity + this.rateItemsArray.rateItems[i].quantity).toFixed(2));
    }
    this.showRate = true;
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
    this.getCategory( this.projectId, this.costHeadId);
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
    this.getCategory(this.projectId, this.costHeadId);
  }

  onActiveWorkItemFailure(error:any) {
    console.log('Active WorkItem error : '+error);
  }

  setCategoryDetailsForDelete(categoryId : any) {
    this.categoryIdForInActive = categoryId;
  }

  inActiveCategory() {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.inActiveCategory( projectId, buildingId, this.costHeadId, this.categoryIdForInActive).subscribe(
      deleteCategory => this.onInActiveCategorySuccess(deleteCategory),
      error => this.onInActiveCategoryFailure(error)
    );
  }

  onInActiveCategorySuccess(deleteCategory : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_CATEGORY;
    this.messageService.message(message);
    this.getCategory( this.projectId, this.costHeadId);
  }

  onInActiveCategoryFailure(error : any) {
    console.log('In Active Category error : '+JSON.stringify(error));
  }

  getCategoryList() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.getCategoryList( projectId, buildingId, this.costHeadId).subscribe(
      categoryList => this.onGetCategoryListSuccess(categoryList),
      error => this.onGetCategoryListFailure(error)
    );
  }

  onGetCategoryListSuccess(categoryList : any) {
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

  onGetCategoryListFailure(error : any) {
    console.log('categoryList error : '+JSON.stringify(error));
  }

  onChangeAddSelectedCategory(selectedCategoryId : number ) {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.activeCategory( projectId, buildingId, this.costHeadId, selectedCategoryId).subscribe(
      building => this.onAddCategorySuccess(building),
      error => this.onAddCategoryFailure(error)
    );
  }

  onAddCategorySuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_CATEGORY;
    this.messageService.message(message);
    this.getCategory(this.projectId, this.costHeadId);
  }

  onAddCategoryFailure(error : any) {
    console.log('building error : '+ JSON.stringify(error));
  }

  refreshCategoryList() {
    this.getCategory( this.projectId, this.costHeadId);
    this.showQuantity = false;
    this.showRate = false;
  }

  setSelectedWorkItems(workItemList:any) {
    this.selectedWorkItems = workItemList;
  }

  deleteElement(elementType : string) {
    if(elementType === ProjectElements.CATEGORY) {
      this.inActiveCategory();
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
