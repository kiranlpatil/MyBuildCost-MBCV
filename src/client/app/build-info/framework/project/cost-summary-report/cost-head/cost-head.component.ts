import { Component, OnInit , OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Messages } from '../../../../../shared/constants';
import { SessionStorage, SessionStorageService, Message, MessageService, LoaderService } from '../../../../../shared/index';
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
  alreadySelectedWorkItems: Array<WorkItem>;

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
  private subCategoryArrayList : Array<SubCategory> = [];

  private workItemListArray: Array<WorkItem> = [];
  private subCategoryListArray : Array<SubCategory> = [];
  private subCategoryObj: Array<SubCategory>;


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
      this.getSubCategoryDetails(this.projectId, this.costHeadId);
    });
  }

  ngOnChanges(changes: any) {
    if (changes.subCategoryListArray.currentValue !== undefined) {
      this.subCategoryListArray = changes.subCategoryListArray.currentValue;
    }
  }

  getQuantity(i: number, quantityItems: any, workItemIndex: number, workItem: WorkItem ,workitemObjId : number) {
    this.compareSubcategoryIndex=i;
    this.toggleQty = !this.toggleQty;
    this.compareWorkItemIndex = workItemIndex;
    if (this.toggleQty === true) {
      this.toggleRate = false;
    }
    this.workItemId = workitemObjId;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
    this.quantityItemsArray = quantityItems;
    this.workItem = workItem;
    this.showQuantity = true;
  }

  getRateFromRateAnalysis(i:number,workItemIndex: number,workItem:WorkItem) {
    this.compareSubcategoryIndex=i;
    this.toggleRate = !this.toggleRate;
    this.compareWorkItemIndex = workItemIndex;
    if (this.toggleRate === true) {
      this.toggleQty = false;
    }
    this.workItem=workItem;
    this.workItemId = workItem.rateAnalysisId;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
    let subCategoryId=this.subCategoryDetails[i].rateAnalysisId;
    this.costSummaryService.getRateItems(this.costHeadId, subCategoryId,this.workItemId).subscribe(
        rateItem => {
          this.onGetRateItemsSuccess(rateItem, workItem);
          },error => this.onGetRateItemsFailure(error)
      );
  }

  onGetRateItemsSuccess(rateItem: any, workItem:any) {
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
      this.totalAmount= this.totalAmount+( rateItem.data.rateItems[i].quantity*rateItem.data.rateItems[i].rate);
      this.totalRate= this.totalRate+rateItem.data.rateItems[i].rate;
      this.totalQuantity=this.totalQuantity+rateItem.data.rateItems[i].quantity;
    }
    this.rateItemsArray.total= this.totalAmount/this.totalQuantity;
    this.showRate = true;
  }

  onGetRateItemsFailure(error: any) {
    console.log(error);
  }

  //Rate from DB
  getRateFromDatabase(i:number,workItemIndex:number,itemArray:Rate, workItem : WorkItem) {
    this.compareSubcategoryIndex=i;
    this.toggleRate = !this.toggleRate;
    this.workItem = workItem;
    this.workItemId = workItem.rateAnalysisId;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
    this.compareWorkItemIndex = workItemIndex;
    if (this.toggleRate === true) {
      this.toggleQty = false;
    }
    this.rateItemsArray=itemArray;
    let rate = new Rate();
    rate.rateItems = itemArray.rateItems;
    rate.rateFromRateAnalysis = itemArray.rateFromRateAnalysis ;
    rate.total = itemArray.total;
    rate.unit = itemArray.unit;
    rate.quantity = itemArray.quantity;
    this.unit=itemArray.unit;
    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;

    for(let i=0; i < this.rateItemsArray.rateItems.length; i++) {
      this.totalAmount = this.totalAmount + ( this.rateItemsArray.rateItems[i].quantity * this.rateItemsArray.rateItems[i].rate );
      this.totalRate = this.totalRate + this.rateItemsArray.rateItems[i].rate;
      this.totalQuantity = this.totalQuantity + this.rateItemsArray.rateItems[i].quantity;
    }
    this.showRate = true;
  }

  getSubCategoryDetails(projectId: string, costHeadId: number) {
    this.costSummaryService.getSubCategory(projectId,costHeadId).subscribe(
      subCategoryDetail => this.OnGetSubCategoryDetailsSuccess(subCategoryDetail),
      error => this.OnGetSubCategoryDetailsFailure(error)
    );
  }

  OnGetSubCategoryDetailsSuccess(subCategoryDetail: any) {
    this.subCategoryDetails = subCategoryDetail.data;
    this.subCategoryDetailsTotalAmount=0.0;

    for(let i=0;i<this.subCategoryDetails.length;i++) {
      this.subCategoryDetailsTotalAmount= ( this.subCategoryDetailsTotalAmount +
        this.subCategoryDetails[i].amount );
    }
    let subcategoryList = lodsh.clone(this.subCategoryArrayList);
    this.subcategoryArray = this.commonService.removeDuplicateItmes(subcategoryList, this.subCategoryDetails);
  }

  OnGetSubCategoryDetailsFailure(error: any) {
    console.log(error);
  }

  setIdsForDeleteWorkItem(i: number,subCategoryId: string, workItemId: string) {
    this.subCategoryId = parseInt(subCategoryId);
     this.workItemId =  parseInt(workItemId);
  }

  deleteWorkItem() {
    this.costSummaryService.deleteWorkItem(parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID)),
      this.subCategoryId, this.workItemId ).subscribe(
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
      this.getSubCategoryDetails(this.projectId, this.costHeadId);
    }
  }

  onDeleteWorkItemFailure(error: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
    this.getSubCategoryDetails(this.projectId, this.costHeadId);
  }

  getWorkItemList(subCategoryId:number,i:number) {
    this.comapreWorkItemRateAnalysisId=i;
    this.subCategoryRateAnalysisId=subCategoryId;
    this.costSummaryService.getWorkItemList(this.costHeadId,subCategoryId).subscribe(
      workItemList => this.onGetWorkItemListSuccess(workItemList),
      error => this.onGetWorkItemListFailure(error)
    );
  }


  onGetWorkItemListSuccess(workItemList:any) {
    let workItemListAfterClone = lodsh.cloneDeep(workItemList.data);
    this.workItemListArray = this.commonService.removeDuplicateItmes(workItemListAfterClone,this.alreadySelectedWorkItems);
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
    this.costSummaryService.addWorkItem(this.costHeadId,subCategoryId,workItemObject[0].rateAnalysisId,workItemObject[0].name).subscribe(
      workItemList => this.onAddWorkItemSuccess(workItemList),
      error => this.onAddWorkItemFailure(error)
    );
  }

  onAddWorkItemSuccess(workItemList:any) {
    this.alreadySelectedWorkItems=workItemList.data;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_WORKITEM;
    this.messageService.message(message);
    this.showWorkItemList=false;
    this.getSubCategoryDetails(this.projectId, this.costHeadId);
  }

  onAddWorkItemFailure(error:any) {
    console.log('onshowWorkItemFail : '+error);
  }

  setSubCategoryDetailsForDelete(subcategory : any) {
    this.subCategoryObj = subcategory;
  }

  deleteSubCategory() {
    let subcategory = this.subCategoryObj;
    this.costSummaryService.deleteSubCategory(this.costHeadId, subcategory).subscribe(
      deleteSubcategory => this.onDeleteSubCategorySuccess(deleteSubcategory),
      error => this.onDeleteSubCategoryFailure(error)
    );
  }

  onDeleteSubCategorySuccess(deleteSubcategory : any) {
    this.getSubCategoryDetails(this.projectId, this.costHeadId);
  }

  onDeleteSubCategoryFailure(error : any) {
    console.log('deleteSubcategory error : '+JSON.stringify(error));
  }

  getSubCategoryList() {
    this.costSummaryService.getSubCategoryList(this.costHeadId).subscribe(
      subcategoryList => this.onGetSubCategoryListSuccess(subcategoryList),
      error => this.onGetSubCategoryListFailure(error)
    );
  }

  onGetSubCategoryListSuccess(subcategoryList : any) {
    this.subCategoryArrayList = subcategoryList.data;
    let subCategoryList = lodsh.cloneDeep(subcategoryList.data);
    this.subcategoryArray = this.commonService.removeDuplicateItmes(subCategoryList, this.subCategoryDetails);
    this.showSubcategoryListvar = true;
  }

  onGetSubCategoryListFailure(error : any) {
    console.log('subcategoryList error : '+JSON.stringify(error));
  }

  onChangeAddSelectedSubCategory( selectedSubCategoryId : string ) {
    let subCategoriesList  =  this.subcategoryArray;
    let subCategoryObj = subCategoriesList.filter(
      function( subCatObj: any){
        return subCatObj.rateAnalysisId === parseInt(selectedSubCategoryId);
    });
    this.costSummaryService.addSubCategory( subCategoryObj, this.costHeadId).subscribe(
      building => this.onAddSubCategorySuccess(building),
      error => this.onAddSubCategoryFailure(error)
    );
  }

  onAddSubCategorySuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_SUBCATEGORY;
    this.messageService.message(message);
    this.getSubCategoryDetails(this.projectId, this.costHeadId);
  }

  onAddSubCategoryFailure(error : any) {
    console.log('building error : '+ JSON.stringify(error));
  }

  refreshSubCategoryList() {
    this.getSubCategoryDetails(this.projectId, this.costHeadId);
    this.showQuantity = false;
    this.showRate = false;
  }

  setAlreadySelectedWorkItems(workItemList:any) {
    this.alreadySelectedWorkItems=workItemList;
  }

}
