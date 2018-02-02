import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { CostSummaryPipe } from './../cost-summary.pipe';
import  { FormBuilder, Validators } from '@angular/forms';

import {
  AppSettings,
  Label,
  Button,
  Headings,
  NavigationRoutes, Messages
} from '../../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService,
  Message, MessageService } from '../../../../../shared/index';
import { CostHeadService } from './cost-head.service';
import { CustomHttp } from '../../../../../shared/services/http/custom.http';
import { FormGroup } from '@angular/forms';
import { Project } from '../../../model/project';


@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-project-report',
  styleUrls: ['cost-head.component.css'],
  templateUrl: 'cost-head.component.html'
})

export class CostHeadComponent implements OnInit {
  projectId : string;
  buildingId: string;
  buildingName: string;
  costHead: string;
  costheadId:number;
  workItemId: number;
  itemName: string;
  subCategoryId: number;
 // costheadId1: number;
  costHeadDetails: any;
  subCategoryDetails: any;
  costHeadItemSave: any;
  estimatedItem : any;
  currentquantityItem: string;
  currentWorkItem: string;
  workItem: any;
  rateItemsTotal: number;
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

  itemSize:number=0;


  quantity:number=0;
  unit:string='';

  workItemId:number;
  showSubcategoryListvar: boolean = false;

  private toggleQty:boolean=false;
  private toggleRate:boolean=false;
  private compareIndex:number=0;
  private quantityItemsArray: any;
  private rateItemsArray: any;
  private subcategoryArray : Array<any> = [];
  private rateIArray: any;
  private workItemListArray: any;
  private subcategoryArray : Array = [];


  showWorkItemList:boolean=false;


  constructor(private costHeadService : CostHeadService, private activatedRoute : ActivatedRoute, private messageService: MessageService) {
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.buildingName = params['buildingName'];
      this.costHead = params['costHeadName'];
      let costheadIdParams = params['costHeadId'];
      this.costheadId = parseInt(costheadIdParams);
      this.getSubCategoryDetails(this.projectId, this.costheadId);
    });
  }

  onSubmit() { }


  getQuantity(i: number, quantityItems: any, workItem: any ,workitemObjId : number) {
    this.toggleQty = !this.toggleQty;
    this.compareIndex = i;
    this.workItemId = workitemObjId;
    if (this.toggleQty === true) {
      this.toggleRate = false;
    }
    this.quantityItemsArray = quantityItems;
    this.getQuantityTotal(this.quantityItemsArray);
    this.workItem = workItem;
  }

  getRate(i: number,workItemId:number) {
    this.toggleRate = !this.toggleRate;
    this.compareIndex = i;
    if (this.toggleRate === true) {
      this.toggleQty = false;
    }

    this.workItemId=workItemId;
    let subCategoryId=this.subCategoryDetails[i].rateAnalysisId;
  console.log('subCategoryId',+subCategoryId);

    this.costHeadService.getRateItems(this.costheadId, subCategoryId,this.workItemId).subscribe(
        rateItem => this.onGetRateItemsSuccess(rateItem),
        error => this.onGetRateItemsFail(error)
      );


    /*this.rateItemsTotal = rateItems.rate.total;
    this.workItem = rateItems.name;*/

    /*if (this.rateItemsTotal === null) {
///:id/building/:buildingid/rate/costhead/:costhead/workitem/:workitem
      console.log('rateItemsTotal is null');
      this.costHeadService.getRateItems(this.costheadId, this.workItem).subscribe(
        rateItem => this.onGetRateItemsSuccess(rateItem),
        error => this.onGetRateItemsFail(error)
      );
    } else {
      this.costHeadService.getRateItems(this.costheadId, this.workItem).subscribe(
        rateItem => this.onGetRateItemsSuccess(rateItem),
        error => this.onGetRateItemsFail(error)
      );
    }*/
  }

  onGetRateItemsSuccess(rateItem: any) {
    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;

    this.rateIArray=rateItem.data;
    this.rateIArray.quantity=rateItem.data.quantity;

    this.rateIArray.unit=rateItem.data.unit;
    this.quantity=rateItem.data.quantity;

    this.unit=rateItem.data.unit;
    this.rateItemsArray = rateItem.data.item;
    let temp=0;

    this.itemSize=rateItem.data.item.length;

    for(let i=0;i<rateItem.data.item.length;i++) {
      this.totalAmount= this.totalAmount+( rateItem.data.item[i].quantity*rateItem.data.item[i].rate);
      this.totalRate= this.totalRate+rateItem.data.item[i].rate;
      this.totalQuantity=this.totalQuantity+rateItem.data.item[i].quantity;
    }
    this.rateIArray.total= this.totalAmount/this.totalQuantity;
  }

  onGetRateItemsFail(error: any) {
    console.log(error);
  }

  //Rate from DB
  getRateFromDatabase(i:number,itemArray:any){
    this.toggleRate = !this.toggleRate;
    this.compareIndex = i;
    if (this.toggleRate === true) {
      this.toggleQty = false;
    }

    /*this.workItemId=workItemId;
    let subCategoryId=this.subCategoryDetails[i].rateAnalysisId;*/
    console.log('item',+itemArray);
    this.rateItemsArray=itemArray.item;
    let rate = {
      item : itemArray.item,
      quantity: itemArray.quantity,
      total : itemArray.total
    };
    /*this.rateIArray.item=itemArray.item;
    this.rateIArray.quantity=itemArray.quantity;
    this.rateIArray.total=itemArray.total;*/
    //TODO with actualll OOP
    this.rateIArray = rate;



    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;


    this.quantity=this.rateIArray.quantity;
    this.rateItemsArray = this.rateIArray.item;
    let temp=0;


    for(let i=0;i<this.rateIArray.item.length;i++) {
      this.totalAmount= this.totalAmount+( this.rateIArray.item[i].quantity*this.rateIArray.item[i].rate);
      this.totalRate= this.totalRate+this.rateIArray.item[i].rate;
      this.totalQuantity=this.totalQuantity+this.rateIArray.item[i].quantity;
    }

   /* this.onGetRateItemsSuccess(rateItem)*/
  }


  getItemRates(workItem: any, costHead: string) {
    console.log('WorkItem : ' + workItem);
    console.log('costHead : ' + costHead);
  }
  getSubCategoryDetails(projectId: string, costheadId: number) {
    this.costHeadService.getSubCategory(projectId,costheadId).subscribe(
      subCategoryDetail => this.OnGetSubCategorySuccess(subCategoryDetail),
      error => this.OnGetSubCategoryFail(error)
    );
  }
  OnGetSubCategorySuccess(subCategoryDetail: any) {
    this.subCategoryDetails = subCategoryDetail.data;
    console.log(this.subCategoryDetails);
  }
  OnGetSubCategoryFail(error: any) {
    console.log(error);
  }
  getCostHeadComponentDetails(projectId: string, costHead: string) {
    this.costHeadService.getCostHeadDetails(projectId, costHead).subscribe(
      costHeadDetail => this.onGetCostHeadDetailsSuccess(costHeadDetail),
      error => this.onGetCostHeadDetailsFail(error)
    );
  }

  onGetCostHeadDetailsSuccess(costHeadDetail: any) {
    this.costHeadDetails = costHeadDetail.data;
  }

  onGetCostHeadDetailsFail(error: any) {
    console.log(error);
  }

  deleteWorkitemfun(workItemName: string) {
    this.currentWorkItem = workItemName;
  }

  deleteWorkitem() {
    this.costHeadService.deleteWorkItemDetails(this.currentWorkItem, this.costHead).subscribe(
      costHeadDetail => this.onDeleteWorkItemSuccess(costHeadDetail),
      error => this.onDeleteWorkItemFail(error)
    );
  }

  onDeleteWorkItemSuccess(costHeadDetail: any) {
    //this.onChangeCostingIn(this.defaultCostIn);
    if (costHeadDetail !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_COSTHEAD_WORKITEM;
      this.messageService.message(message);
      this.getCostHeadComponentDetails(this.projectId, this.costHead);
      /* this.costSummaryService.onCostHeadUpdate(costHeadDetail);*/
    }
  }

  onDeleteWorkItemFail(error: any) {
    console.log(error);
  }

  getMessages() {
    return Messages;
  }

  getLabels() {
    return Label;
  }

  getButtons() {
    return Button;
  }

  getHeadings() {
    return Headings;
  }


 deleteQuantityItem(subCategoryId: number,  quantityItems:any ,itemName: string) {
   this.itemName = itemName;
   this.subCategoryId = subCategoryId
  this.quantityItemsArray = quantityItems.data;
   //this.currentquantityItem = quantityItem;
   console.log(  this.itemName);
 }

  deleteQuantityItemfun() {
    this.costHeadService.deleteCostHeadItems(parseInt(this.costheadId), this.subCategoryId, this.workItemId,this.quantityItemsArray,this.itemName).subscribe(
      costHeadItemDelete => this.onDeleteCostHeadItemsSuccess(costHeadItemDelete),
      error => this.onDeleteCostHeadItemsFail(error)
    );
  }

  onDeleteCostHeadItemsSuccess(costHeadItemDelete: any) {
    this.quantityItemsArray = costHeadItemDelete.data.item;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_ITEM;
    this.messageService.message(message);
    //this.getQuantity(i, this.quantityItemsArray)
    this.getQuantityTotal(this.quantityItemsArray);
   // this.getCostHeadComponentDetails(this.projectId, this.costHead);
  }

  onDeleteCostHeadItemsFail(error: any) {
    console.log(error);
  }

  addItem() {
    console.log('addItems()');
    let quantity = {
      'item': '',
      'remarks': '',
      'nos': 0,
      'length': 0,
      'breadth': '0',
      'height': 0,
      'quantity': '',
      'unit': 'sqft'

    };
    this.quantityItemsArray.push(quantity);
    /*this.costHeadService.addCostHeadItems(this.costHead,this.workItem,body).subscribe(
      costHeadItemAdd => this.onAddCostHeadItemsSuccess(costHeadItemAdd),
      error => this.onAddCostHeadItemsFail(error)
    );*/
  }

  /*
    onAddCostHeadItemsSuccess(costHeadItemAdd : any) {
      this.quantityItemsArray=costHeadItemAdd.data.item;
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_ADD_ITEM;
      this.messageService.message(message);
      this.getCostHeadComponentDetails(this.projectId,this.costHead);
    }

  onAddCostHeadItemsFail(error : any) {
    console.log(error);
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_FAIL_ADD_ITEM + error.err_msg;
    this.messageService.message(message);
  }*/
  getNo(quantityItems : any) {
  this.quanitytNumbersTotal =0;
    for(let i=0;i<this.quantityItemsArray.length;i++) {
      this.quanitytNumbersTotal= this.quanitytNumbersTotal +this.quantityItemsArray[i].nos;
    }
    }
  getLength(quantityItems : any) {
  this.lengthTotal = 0;
   for (let i = 0; i < this.quantityItemsArray.length; i++) {
      this.lengthTotal = this.lengthTotal + this.quantityItemsArray[i].length;
        }
    this.updateQuantity(this.quantityItemsArray);
  }
  getBreadth(quantityItems : any) {
  this.breadthTotal= 0;
   for(let i=0;i<this.quantityItemsArray.length;i++) {
      this.breadthTotal = this.breadthTotal +this.quantityItemsArray[i].breadth;
    }
    this.updateQuantity(this.quantityItemsArray);
}
getHeight(quantityItems: any) {
  this.heightTotal=0;
   for(let i=0;i<this.quantityItemsArray.length;i++) {
      this.heightTotal = this.heightTotal +this.quantityItemsArray[i].height;
    }
    this.updateQuantity(this.quantityItemsArray);
  }
  updateQuantity(quantityItems : any) {
    this.quantityTotal = 0;
    this.quantityItemsArray = quantityItems;
    for(let i=0;i<this.quantityItemsArray.length;i++) {
      if(this.quantityItemsArray[i].length === undefined || this.quantityItemsArray[i].length === 'NAN' || this.quantityItemsArray[i].length === null) {
        var q1 = this.quantityItemsArray[i].height;
        var q2 = this.quantityItemsArray[i].breadth;
      } else if(this.quantityItemsArray[i].height === undefined || this.quantityItemsArray[i].height === 'NAN' || this.quantityItemsArray[i].height === null) {
        q1 = this.quantityItemsArray[i].length;
        q2 = this.quantityItemsArray[i].breadth;
      } else if(this.quantityItemsArray[i].breadth === undefined || this.quantityItemsArray[i].breadth === 'NAN' || this.quantityItemsArray[i].breadth === null) {
        q1 = this.quantityItemsArray[i].length;
        q2 = this.quantityItemsArray[i].height;
      } else {
        q1 = this.quantityItemsArray[i].length;
        q2 = this.quantityItemsArray[i].breadth;
       // q3 = this.quantityItemsArray[i].height;
      }
      this.quantityItemsArray[i].quantity = q1 * q2;
      this.quantityTotal = this.quantityTotal + this.quantityItemsArray[i].quantity;
    }
  }
 getQuantityTotal(quantityItems : any) {
    this.updateQuantity(quantityItems);
   this.getHeight(quantityItems);
   this.getLength(quantityItems);
   this.getNo(quantityItems);
   this.getBreadth(quantityItems);
   }

  updateCostHeadWorkItem(subCategoryId : number, quantityItems : any) {
    this.quantityItemsArray = quantityItems;
    this.costHeadService.saveCostHeadItems(parseInt(this.costheadId), subCategoryId, this.workItemId,this.quantityItemsArray).subscribe(
      costHeadItemSave => this.onSaveCostHeadItemsSuccess(costHeadItemSave),
      error => this.onSaveCostHeadItemsFail(error)
    );
  }


  onSaveCostHeadItemsSuccess(costHeadItemSave: any) {
    this.quantityItemsArray = costHeadItemSave.data.item;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM;
    this.messageService.message(message);
   // this.getCostHeadComponentDetails(this.projectId, this.costHead);
  }

  onSaveCostHeadItemsFail(error: any) {
    console.log(error);
  }

  changeQuantity(quantity:string,k:number) {
    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;
    this.rateItemsArray[k].quantity=parseInt(quantity);
    for(let i=0;i<this.rateItemsArray.length;i++) {
      this.totalAmount= this.totalAmount+( this.rateItemsArray[i].quantity*this.rateItemsArray[i].rate);
      this.totalRate= this.totalRate+this.rateItemsArray[i].rate;
      this.totalQuantity=this.totalQuantity+this.rateItemsArray[i].quantity;
    }
    this.rateIArray.total= this.totalAmount/this.totalQuantity;
}


  changeRate(rate:string, k:number) {
    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;
    this.rateItemsArray[k].rate= parseInt(rate);
    console.log('k'+k);
    for(let i=0;i<this.rateItemsArray.length;i++) {
      this.totalAmount= this.totalAmount+( this.rateItemsArray[i].quantity*this.rateItemsArray[i].rate);
      this.totalRate= this.totalRate+this.rateItemsArray[i].rate;
      this.totalQuantity=this.totalQuantity+this.rateItemsArray[i].quantity;
    }
    this.rateIArray.total= this.totalAmount/this.totalQuantity;
  }

  showWorkItem(subCategoryDetails:any) {
    this.showWorkItemList=true;
    let costheadId=77;
    let subCategoryId=0;
    this.costHeadService.showWorkItem(costheadId,subCategoryId).subscribe(
      workItemList => this.onshowWorkItemSuccess(workItemList),
      error => this.onshowWorkItemFail(error)
    );
  }


  onshowWorkItemSuccess(workItemList:any) {
  this.workItemListArray=workItemList.data;
  }

  onshowWorkItemFail(error:any) {
    console.log('onshowWorkItemFail : '+error);
  }

  onChangeWorkItem(selectedWorkItem:any) {
    console.log('selectedWorkItem : '+selectedWorkItem);
    this.showWorkItemList=false;

    let costheadId=77;
    let subCategoryId=0;
    this.costHeadService.addWorkItem(costheadId,subCategoryId,selectedWorkItem).subscribe(
      workItemList => this.onaddWorkItemSuccess(workItemList),
      error => this.onaddWorkItemFail(error)
    );
  }

  onaddWorkItemSuccess(workItemList:any) {
    this.workItemListArray=workItemList.data;
  }

  onaddWorkItemFail(error:any) {
    console.log('onshowWorkItemFail : '+error);
  }

  updateRate(i:number) {
    let subCategoryId=this.subCategoryDetails[i].rateAnalysisId;
    console.log('subCategoryId',+subCategoryId);


    this.rateIArray.total=this.totalAmount/this.totalQuantity;
    this.costHeadService.updateRateItems(this.costheadId, subCategoryId,this.workItemId,this.rateIArray).subscribe(
      rateItem => this.onUpdateRateItemsSuccess(rateItem),
      error => this.onUpdateRateItemsFail(error)
    );
  }

  onUpdateRateItemsSuccess(rateItem: any) {
    console.log('Rate updated successfully');
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_RATE;
    this.messageService.message(message);
  }

  onUpdateRateItemsFail(error: any) {
    console.log(error);
  }

  getPreviousQuantity(previousTotalQuantity:number) {
    console.log('previousTotalQuantity : '+previousTotalQuantity);
    this.previousTotalQuantity=previousTotalQuantity;
  }

  onTotalQuantityChange(newTotalQuantity:number) {
    console.log('newTotalQuantity : '+newTotalQuantity);
    this.quantityIncrement=newTotalQuantity/this.previousTotalQuantity;
    console.log('quantityIncrement : '+this.quantityIncrement);

    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;

    for(let i=0;i<this.itemSize;i++) {
      this.rateItemsArray[i].quantity=this.rateItemsArray[i].quantity*this.quantityIncrement;
      this.totalAmount= this.totalAmount+( this.rateItemsArray[i].quantity*this.rateItemsArray[i].rate);
      this.totalRate= this.totalRate+this.rateItemsArray[i].rate;
      this.totalQuantity=this.totalQuantity+ this.rateItemsArray[i].quantity;
    }

    this.totalItemRateQuantity=newTotalQuantity
    this.rateIArray.quantity=newTotalQuantity;
    this.rateIArray.total= this.totalAmount/this.totalQuantity;

  }

  deleteSubcategory(subcategory : any) {
    this.costHeadService.deleteSubcategoryFromCostHead(this.costheadId, subcategory).subscribe(
      deleteSubcategory => this.deleteSubcategorySuccess(deleteSubcategory),
      error => this.deleteSubcategoryFail(error)
    );
  }

  deleteSubcategorySuccess(deleteSubcategory : any) {
    console.log('deleteSubcategory : '+JSON.stringify(deleteSubcategory));
    this.getSubCategoryDetails(this.projectId, this.costheadId);
  }

  deleteSubcategoryFail(error : any) {
    console.log('deleteSubcategory error : '+JSON.stringify(error));
  }

  showSubcategoryList() {
    this.costHeadService.getSubCategoryList(this.costheadId).subscribe(
      subcategoryList => this.onGetSubCategoryListSuccess(subcategoryList),
      error => this.onGetSubCategoryListFail(error)
    );
  }

  onGetSubCategoryListSuccess(subcategoryList : any) {
    this.subcategoryArray = subcategoryList.data;
    this.showSubcategoryListvar = true;
  }

  onGetSubCategoryListFail(error : any) {
    console.log('subcategoryList error : '+JSON.stringify(error));
  }

  onSelectedAddSubCategory( selectedSubCategoryId : string ) {
    let subCategoriesList  =  this.subcategoryArray;
    let subCategoryObj = subCategoriesList.filter(
      function( subCatObj: any){
        return subCatObj.rateAnalysisId === parseInt(selectedSubCategoryId);
    });
    this.costHeadService.addSubCategory( subCategoryObj, this.costheadId).subscribe(
      building => this.onAddSubCategorySuccess(building),
      error => this.onAddSubCategoryFail(error)
    );
  }

  onAddSubCategorySuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_SUBCATEGORY;
    this.messageService.message(message);
    this.getSubCategoryDetails(this.projectId, this.costheadId);
  }

  onAddSubCategoryFail(error : any) {
    console.log('building error : '+ JSON.stringify(error));
  }

}
