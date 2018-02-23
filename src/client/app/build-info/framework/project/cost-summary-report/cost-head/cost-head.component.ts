import { Component, OnInit , OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Messages } from '../../../../../shared/constants';
import { SessionStorage, SessionStorageService, Message, MessageService, LoaderService } from '../../../../../shared/index';
import { Rate } from '../../../model/rate';
import { CommonService } from '../../../../../shared/services/common.service';
import { CostSummaryService } from '../cost-summary.service';
import * as lodsh from 'lodash';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head',
  styleUrls: ['cost-head.component.css'],
  templateUrl: 'cost-head.component.html'
})

export class CostHeadComponent implements OnInit, OnChanges {
  projectId : string;
  buildingId: string;
  buildingName: string;
  costHead: string;
  costheadId:number;
  workItemId: number;
  itemName: string;
  subCategoryId: number;
  costHeadDetails: any;
  subCategoryDetails: any;
  subCategoryDetailsTotalAmount: number=0;
  costHeadItemSave: any;
  itemArray : any;
  workItem: any;
  quantityTotal: number = 0;
  quanitytNumbersTotal: number = 0;
  lengthTotal: number = 0;
  breadthTotal: number = 0;
  heightTotal: number = 0;
  totalAmount:number=0;
  totalRate:number=0;
  totalQuantity:number=0;
  total:number=0;
  quantityIncrement:number=1;
  previousTotalQuantity:number=1;
  totalItemRateQuantity:number=0;
  subcategoryRateAnalysisId:number;
  comapreWorkItemRateAnalysisId:number;
  itemSize:number=0;
  quantity:number=0;
  rateFromRateAnalysis:number=0;
  unit:string='';
  showSubcategoryListvar: boolean = false;
  alreadySelectedWorkItems:any;


  private showQuantity:boolean=true;
  private showRate:boolean=true;
  private toggleQty:boolean=false;
  private toggleRate:boolean=false;
  private compareWorkItemIndex:number=0;
  private compareSubcategoryIndex:number=0;
  private quantityItemsArray: any;
  private rateItemsArray: any;
  private subcategoryArray : Array<any> = [];
  private subcategoryArrayList : Array<any> = [];
  private rateIArray: any;
  private workItemListArray: any;
  private subcategoryListArray : Array<any> = [];
  private showWorkItemList:boolean=false;
  private subCategoryObj: any;


  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private messageService: MessageService, private commonService : CommonService,
              private loderService: LoaderService) {
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.buildingName = params['buildingName'];
      this.costHead = params['costHeadName'];
      let costheadIdParams = params['costHeadId'];
      this.costheadId = parseInt(costheadIdParams);
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_COST_HEAD_ID,this.costheadId);
      this.getSubCategoryDetails(this.projectId, this.costheadId);
    });
  }

  ngOnChanges(changes: any) {
    if (changes.subcategoryListArray.currentValue !== undefined) {
      this.subcategoryListArray = changes.subcategoryListArray.currentValue;
    }
  }

  getQuantity(i: number, quantityItems: any, workItemIndex: number, workItem: any ,workitemObjId : number) {
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

  getRateFromRateAnalysis(i:number,workItemIndex: number,workItem:any) {
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
    this.costSummaryService.getRateItems(this.costheadId, subCategoryId,this.workItemId).subscribe(
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

    for(let i=0;i<rateItem.data.items.length;i++) {
      this.totalAmount= this.totalAmount+( rateItem.data.items[i].quantity*rateItem.data.items[i].rate);
      this.totalRate= this.totalRate+rateItem.data.items[i].rate;
      this.totalQuantity=this.totalQuantity+rateItem.data.items[i].quantity;
    }
    this.rateItemsArray.total= this.totalAmount/this.totalQuantity;
    this.showRate = true;
  }

  onGetRateItemsFailure(error: any) {
    console.log(error);
  }

  //Rate from DB
  getRateFromDatabase(i:number,workItemIndex:number,itemArray:any, workItem : any) {
    this.compareSubcategoryIndex=i;
    this.toggleRate = !this.toggleRate;
    this.workItem = workItem;
    this.workItemId = workItem.rateAnalysisId;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
    this.compareWorkItemIndex = workItemIndex;
    if (this.toggleRate === true) {
      this.toggleQty = false;
    }
    this.itemArray = itemArray;
    this.rateItemsArray=itemArray;
    let rate = new Rate();
    rate.items = itemArray.items;
    rate.rateFromRateAnalysis = this.itemArray.rateFromRateAnalysis ;
    rate.quantity =   this.itemArray.quantity;
    rate.unit =   this.itemArray.unit;
    rate.total = itemArray.total;
    rate.unit = itemArray.unit;
    rate.quantity = itemArray.quantity;
    this.unit=itemArray.unit;
    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;

    for(let i=0;i<this.rateItemsArray.items.length;i++) {
      this.totalAmount = this.totalAmount + ( this.rateItemsArray.items[i].quantity * this.rateItemsArray.items[i].rate );
      this.totalRate = this.totalRate + this.rateItemsArray.items[i].rate;
      this.totalQuantity = this.totalQuantity + this.rateItemsArray.items[i].quantity;
    }
    this.showRate = true;
  }

  getSubCategoryDetails(projectId: string, costheadId: number) {
    this.costSummaryService.getSubCategoryDetails(projectId,costheadId).subscribe(
      subCategoryDetail => this.OnGetSubCategoryDetailsSuccess(subCategoryDetail),
      error => this.OnGetSubCategoryDetailsFailure(error)
    );
  }

  OnGetSubCategoryDetailsSuccess(subCategoryDetail: any) {
    this.subCategoryDetails = subCategoryDetail.data;
    this.subCategoryDetailsTotalAmount=0.0;

    for(let i=0;i<this.subCategoryDetails.length;i++) {
      this.subCategoryDetailsTotalAmount= (this.subCategoryDetailsTotalAmount+
        this.subCategoryDetails[i].amount);
    }


    let subcategoryList = lodsh.clone(this.subcategoryArrayList);
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
      this.getSubCategoryDetails(this.projectId, this.costheadId);
    }
  }

  onDeleteWorkItemFailure(error: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
    this.getSubCategoryDetails(this.projectId, this.costheadId);
  }

  getWorkItemList(subCategoryId:number,i:number) {
    this.comapreWorkItemRateAnalysisId=i;
    this.subcategoryRateAnalysisId=subCategoryId;
    this.costSummaryService.getWorkItemList(this.costheadId,subCategoryId).subscribe(
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

    let subCategoryId=this.subcategoryRateAnalysisId;
    this.costSummaryService.addWorkItem(this.costheadId,subCategoryId,workItemObject[0].rateAnalysisId,workItemObject[0].name).subscribe(
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
    this.getSubCategoryDetails(this.projectId, this.costheadId);
  }

  onAddWorkItemFailure(error:any) {
    console.log('onshowWorkItemFail : '+error);
  }

  setSubCategoryDetailsForDelete(subcategory : any) {
    this.subCategoryObj = subcategory;
  }

  deleteSubCategory() {
    let subcategory = this.subCategoryObj;
    this.costSummaryService.deleteSubCategory(this.costheadId, subcategory).subscribe(
      deleteSubcategory => this.onDeleteSubCategorySuccess(deleteSubcategory),
      error => this.onDeleteSubCategoryFailure(error)
    );
  }

  onDeleteSubCategorySuccess(deleteSubcategory : any) {
    this.getSubCategoryDetails(this.projectId, this.costheadId);
  }

  onDeleteSubCategoryFailure(error : any) {
    console.log('deleteSubcategory error : '+JSON.stringify(error));
  }

  getSubCategoryList() {
    this.costSummaryService.getSubCategoryList(this.costheadId).subscribe(
      subcategoryList => this.onGetSubCategoryListSuccess(subcategoryList),
      error => this.onGetSubCategoryListFailure(error)
    );
  }

  onGetSubCategoryListSuccess(subcategoryList : any) {
    this.subcategoryArrayList = subcategoryList.data;
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
    this.costSummaryService.addSubCategory( subCategoryObj, this.costheadId).subscribe(
      building => this.onAddSubCategorySuccess(building),
      error => this.onAddSubCategoryFailure(error)
    );
  }

  onAddSubCategorySuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_SUBCATEGORY;
    this.messageService.message(message);
    this.getSubCategoryDetails(this.projectId, this.costheadId);
  }

  onAddSubCategoryFailure(error : any) {
    console.log('building error : '+ JSON.stringify(error));
  }

  refreshSubCategoryList() {
    this.getSubCategoryDetails(this.projectId, this.costheadId);
    this.showQuantity = false;
    this.showRate = false;
  }

  setAlreadySelectedWorkItems(workItemList:any) {
    this.alreadySelectedWorkItems=workItemList;
  }

}
