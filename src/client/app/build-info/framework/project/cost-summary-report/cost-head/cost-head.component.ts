import { Component, OnInit , OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Messages, ProjectElements, TableHeadings, Button, Label } from '../../../../../shared/constants';
import { SessionStorage, SessionStorageService, Message, MessageService } from '../../../../../shared/index';
import { Rate } from '../../../model/rate';
import { CommonService } from '../../../../../shared/services/common.service';
import { CostSummaryService } from '../cost-summary.service';
import * as lodsh from 'lodash';
import { SubCategory } from '../../../model/sub-category';
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
  subCategoryId: number;
  subCategoryDetails: Array<SubCategory>;
  subCategoryDetailsTotalAmount: number=0;
  workItem: WorkItem;
  totalAmount:number=0;
  totalRate:number=0;
  totalQuantity:number=0;
  subCategoryRateAnalysisId:number;
  comapreWorkItemRateAnalysisId:number;
  quantity:number=0;
  rateFromRateAnalysis:number=0;
  unit:string='';
  showSubcategoryListvar: boolean = false;
  selectedWorkItems: Array<WorkItem>;
  deleteConfirmationSubCategory = ProjectElements.SUBCATEGORY;
  deleteConfirmationWorkItem = ProjectElements.WORK_ITEM;

  private showQuantity:boolean=true;
  private showRate:boolean=true;
  private toggleQty:boolean=false;
  private toggleRate:boolean=false;
  private showWorkItemList:boolean=false;
  private compareWorkItemIndex:number=0;
  private compareSubcategoryIndex:number=0;
  private quantityItemsArray: QuantityItem;
  private rateItemsArray: Rate;
  private subcategoryArray : Array<SubCategory> = [];

  private workItemListArray: Array<WorkItem> = [];
  private subCategoryListArray : Array<SubCategory> = [];
  private subCategoryIdForInactive: number;

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
      this.getSubCategory( this.projectId, this.costHeadId);
    });
  }

  getSubCategory(projectId: string, costHeadId: number) {
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.costSummaryService.getSubCategory( projectId, buildingId, costHeadId).subscribe(
      subCategoryDetails => this.OnGetSubCategorySuccess(subCategoryDetails),
      error => this.OnGetSubCategoryFailure(error)
    );
  }

  OnGetSubCategorySuccess(subCategoryDetails: any) {
    this.subCategoryDetails = subCategoryDetails.data;
    this.subCategoryDetailsTotalAmount=0.0;
    this.totalQuantityOfWorkItems=0.0;
    this.totalRateUnitOfWorkItems=0.0;
    this.totalAmountOfWorkItems=0.0;

    for(let subCategoryIndex=0; subCategoryIndex < this.subCategoryDetails.length; subCategoryIndex++) {

      this.subCategoryDetailsTotalAmount = parseFloat(( this.subCategoryDetailsTotalAmount +
        this.subCategoryDetails[subCategoryIndex].amount).toFixed(2));

      for(let workItemIdex=0; workItemIdex < this.subCategoryDetails[subCategoryIndex].workItems.length; workItemIdex++) {

        this.totalQuantityOfWorkItems = parseFloat((this.totalQuantityOfWorkItems +
          this.subCategoryDetails[subCategoryIndex].workItems[workItemIdex].quantity.total).toFixed(2));

        this.totalRateUnitOfWorkItems = parseFloat((this.totalRateUnitOfWorkItems +
          this.subCategoryDetails[subCategoryIndex].workItems[workItemIdex].rate.total).toFixed(2));

        this.totalAmountOfWorkItems = parseFloat((this.totalAmountOfWorkItems +
          (this.subCategoryDetails[subCategoryIndex].workItems[workItemIdex].quantity.total *
          this.subCategoryDetails[subCategoryIndex].workItems[workItemIdex].rate.total)).toFixed(2));

        this.subCategoryDetails[subCategoryIndex].workItems[workItemIdex].quantity.total =
          parseFloat((this.subCategoryDetails[subCategoryIndex].workItems[workItemIdex].quantity.total).toFixed(2));

        this.subCategoryDetails[subCategoryIndex].workItems[workItemIdex].amount=
          parseFloat((this.subCategoryDetails[subCategoryIndex].workItems[workItemIdex].quantity.total *
            this.subCategoryDetails[subCategoryIndex].workItems[workItemIdex].rate.total).toFixed(2));
      }
    }

    let subcategoryList = lodsh.clone(this.subcategoryArray);
    this.subcategoryArray = this.commonService.removeDuplicateItmes(subcategoryList, this.subCategoryDetails);
  }

  OnGetSubCategoryFailure(error: any) {
    console.log(error);
  }

  ngOnChanges(changes: any) {
    if (changes.subCategoryListArray.currentValue !== undefined) {
      this.subCategoryListArray = changes.subCategoryListArray.currentValue;
    }
  }

  getQuantity( subCategoryIndex: number, workItemIndex: number, workItemId : number, workItem: WorkItem, quantityItems: any) {
    this.compareSubcategoryIndex = subCategoryIndex;
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

  getRateFromRateAnalysis( subCategoryIndex:number, workItemIndex: number, workItem:WorkItem) {
    this.compareSubcategoryIndex = subCategoryIndex;
    this.toggleRate = !this.toggleRate;
    this.compareWorkItemIndex = workItemIndex;
    if (this.toggleRate === true) {
      this.toggleQty = false;
    }
    this.workItem = workItem;
    this.workItemId = workItem.rateAnalysisId;

    SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
    let subCategoryId=this.subCategoryDetails[subCategoryIndex].rateAnalysisId;
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.getRateItems( projectId, buildingId, this.costHeadId, subCategoryId, this.workItemId).subscribe(
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
    this.compareSubcategoryIndex=i;
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

  setIdsForDeleteWorkItem(subCategoryId: string, workItemId: string) {
    this.subCategoryId = parseInt(subCategoryId);
    this.workItemId =  parseInt(workItemId);
  }

  deleteWorkItem() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let costHeadId=parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));

    this.costSummaryService.deleteWorkItem( projectId, buildingId, costHeadId, this.subCategoryId, this.workItemId ).subscribe(
      costHeadDetail => this.onDeleteWorkItemSuccess(costHeadDetail),
      error => this.onDeleteWorkItemFailure(error)
    );
  }

  onDeleteWorkItemSuccess(workItemDetails: any) {
    if (workItemDetails !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_COSTHEAD_WORKITEM;
      this.messageService.message(message);
      this.getSubCategory( this.projectId, this.costHeadId);
    }
  }

  onDeleteWorkItemFailure(error: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
    this.getSubCategory( this.projectId, this.costHeadId);
  }

  getWorkItemList( subCategoryId:number, workItemIndex:number) {
    this.comapreWorkItemRateAnalysisId = workItemIndex;
    this.subCategoryRateAnalysisId = subCategoryId;

    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.getWorkItemList( projectId, buildingId, this.costHeadId, subCategoryId).subscribe(
      workItemList => this.onGetWorkItemListSuccess(workItemList),
      error => this.onGetWorkItemListFailure(error)
    );
  }

  onGetWorkItemListSuccess(workItemList:any) {
    let workItemListAfterClone = lodsh.cloneDeep(workItemList.data);
    this.workItemListArray = this.commonService.removeDuplicateItmes(workItemListAfterClone, this.selectedWorkItems);
    if(this.workItemListArray.length===0) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_ALREADY_ADDED_ALL_WORKITEMS;
      this.messageService.message(message);
    }else {
      this.showWorkItemList=true;
    }
  }

  onGetWorkItemListFailure(error:any) {
    console.log('onshowWorkItemFail : '+error);
  }

  onChangeAddSelectedWorkItem(selectedWorkItem:any) {
    this.showWorkItemList=false;

    let workItemList  =  this.workItemListArray;
    let workItemObject = workItemList.filter(
      function( workItemObj: any){
        return workItemObj.name === selectedWorkItem;
      });

    let subCategoryId=this.subCategoryRateAnalysisId;
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.addWorkItem( projectId, buildingId, this.costHeadId, subCategoryId, workItemObject[0].rateAnalysisId,
      workItemObject[0].name).subscribe(
      workItemList => this.onAddWorkItemSuccess(workItemList),
      error => this.onAddWorkItemFailure(error)
    );
  }

  onAddWorkItemSuccess(workItemList:any) {
    this.selectedWorkItems=workItemList.data;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_WORKITEM;
    this.messageService.message(message);
    this.showWorkItemList=false;
    this.getSubCategory(this.projectId, this.costHeadId);
  }

  onAddWorkItemFailure(error:any) {
    console.log('onshowWorkItemFail : '+error);
  }

  setSubCategoryDetailsForDelete(subCategoryId : any) {
    this.subCategoryIdForInactive = subCategoryId;
  }

  inActiveCategory() {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.inActiveCategory( projectId, buildingId, this.costHeadId, this.subCategoryIdForInactive).subscribe(
      deleteSubcategory => this.onInActiveCategorySuccess(deleteSubcategory),
      error => this.onInActiveCategoryFailure(error)
    );
  }

  onInActiveCategorySuccess(deleteSubcategory : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_SUBCATEGORY;
    this.messageService.message(message);
    this.getSubCategory( this.projectId, this.costHeadId);
  }

  onInActiveCategoryFailure(error : any) {
    console.log('In Active Subcategory error : '+JSON.stringify(error));
  }

  getSubCategoryList() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.getSubCategoryList( projectId, buildingId, this.costHeadId).subscribe(
      subcategoryList => this.onGetSubCategoryListSuccess(subcategoryList),
      error => this.onGetSubCategoryListFailure(error)
    );
  }

  onGetSubCategoryListSuccess(subcategoryList : any) {
    if(subcategoryList.data.length!==0) {
    this.subcategoryArray = subcategoryList.data;
    this.showSubcategoryListvar = true;
    } else {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_ALREADY_ADDED_ALL_SUBCATEGORIES;
      this.messageService.message(message);
    }
  }

  onGetSubCategoryListFailure(error : any) {
    console.log('subcategoryList error : '+JSON.stringify(error));
  }

  onChangeAddSelectedSubCategory( selectedSubCategoryId : number ) {
    let subCategoriesList  =  this.subcategoryArray;
    /*let subCategoryObject = subCategoriesList.filter(
      function( subCatObject: any){
        return subCatObject.rateAnalysisId === parseInt(selectedSubCategoryId);
      });*/
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.activeCategory( projectId, buildingId, this.costHeadId, selectedSubCategoryId).subscribe(
      building => this.onAddSubCategorySuccess(building),
      error => this.onAddSubCategoryFailure(error)
    );
  }

  onAddSubCategorySuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_SUBCATEGORY;
    this.messageService.message(message);
    this.getSubCategory(this.projectId, this.costHeadId);
  }

  onAddSubCategoryFailure(error : any) {
    console.log('building error : '+ JSON.stringify(error));
  }

  refreshSubCategoryList() {
    this.getSubCategory( this.projectId, this.costHeadId);
    this.showQuantity = false;
    this.showRate = false;
  }

  setSelectedWorkItems(workItemList:any) {
    this.selectedWorkItems = workItemList;
  }

  deleteElement(elementType : string) {
    if(elementType === ProjectElements.SUBCATEGORY) {
      this.inActiveCategory();
    }
    if(elementType === ProjectElements.WORK_ITEM) {
      this.deleteWorkItem();
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
