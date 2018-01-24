import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { CostSummaryPipe } from './../cost-summary.pipe';

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


@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-project-report',
  styleUrls: ['cost-head.component.css'],
  templateUrl: 'cost-head.component.html'
})

export class CostHeadComponent implements OnInit {

 private toggleQty:boolean=false;
 private toggleRate:boolean=false;
 private compareIndex:number=0;
 private quantityItemsArray: any;
 private rateItemsArray: any;

  projectId : string;
  buildingId: string;
  buildingName: string;
  costHead:  string;
  costHeadDetails :any;
  currentquantityItem: string
  currentWorkItem: string;
  workItem:any;
  rateItemsTotal:number;
  quantityTotal:number = 0;
  quanitytNumbersTotal:number = 0;
  lengthTotal:number = 0;
  breadthTotal:number = 0;
  heightTotal:number = 0;


  constructor(private costHeadService : CostHeadService, private activatedRoute : ActivatedRoute, private messageService: MessageService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.buildingName = params['buildingName'];
      this.costHead = params['costHead'];
      this.getCostHeadComponentDetails(this.projectId,this.costHead);
    });
  }

  onSubmit() {
  }

  getQuantity(i:number, quantityItems : any,workItem:any) {
    this.toggleQty=!this.toggleQty;
    this.compareIndex=i;
    if(this.toggleQty===true) {
      this.toggleRate=false;
    }
    this.quantityItemsArray = quantityItems;
    this.getQuantityTotal(this.quantityItemsArray);
    this.workItem=workItem;
  }

  getRate(i:number, rateItems : any) {
    this.toggleRate=!this.toggleRate;
    this.compareIndex=i;
    if(this.toggleRate===true) {
      this.toggleQty=false;
    }
    this.rateItemsTotal=rateItems.rate.total;
    this.workItem=rateItems.name;

    if(this.rateItemsTotal===null) {
///:id/building/:buildingid/rate/costhead/:costhead/workitem/:workitem
      console.log('rateItemsTotal is null');
      this.costHeadService.getRateItems(this.costHead,this.workItem).subscribe(
        rateItem => this.onGetRateItemsSuccess(rateItem),
        error => this.onGetRateItemsFail(error)
      );
    } else {
      this.costHeadService.getRateItems(this.costHead,this.workItem).subscribe(
        rateItem => this.onGetRateItemsSuccess(rateItem),
        error => this.onGetRateItemsFail(error)
      );
    }
  }

  onGetRateItemsSuccess(rateItem : any) {
    this.rateItemsArray=rateItem.data.item;
  }

  onGetRateItemsFail(error : any) {
    console.log(error);
  }

  getItemRates(workItem: any, costHead:string) {
    console.log('WorkItem : '+workItem);
    console.log('costHead : '+costHead);
  }



  getCostHeadComponentDetails(projectId:string, costHead: string) {
    this.costHeadService.getCostHeadDetails(projectId, costHead).subscribe(
      costHeadDetail => this.onGetCostHeadDetailsSuccess(costHeadDetail),
      error => this.onGetCostHeadDetailsFail(error)
    );
  }

  onGetCostHeadDetailsSuccess(costHeadDetail : any) {
    this.costHeadDetails = costHeadDetail.data;
  }

  onGetCostHeadDetailsFail(error : any) {
    console.log(error);
  }

  deleteWorkitemfun(workItemName: string) {
    this.currentWorkItem = workItemName;
  }
  deleteWorkitem( ) {
    this.costHeadService.deleteWorkItemDetails(this.currentWorkItem, this.costHead).subscribe(
        costHeadDetail => this.onDeleteWorkItemSuccess(costHeadDetail),
        error => this.onDeleteWorkItemFail(error)
      );
    }
  onDeleteWorkItemSuccess(costHeadDetail: any) {
    //this.onChangeCostingIn(this.defaultCostIn);
    if ( costHeadDetail!== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_COSTHEAD_WORKITEM;
      this.messageService.message(message);
      this.getCostHeadComponentDetails(this.projectId,this.costHead);
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
  deleteQuantityItemfun(quantityItem:string) {
    this.currentquantityItem = quantityItem;
    console.log(this.currentquantityItem);
  }
  deleteQuantityItem() {
    this.costHeadService.deleteCostHeadItems(this.costHead,this.workItem, this.currentquantityItem).subscribe(
      costHeadItemDelete => this.onDeleteCostHeadItemsSuccess(costHeadItemDelete),
      error => this.onDeleteCostHeadItemsFail(error)
    );
  }

  onDeleteCostHeadItemsSuccess(costHeadItemDelete : any) {
    this.quantityItemsArray=costHeadItemDelete.data.item;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_ITEM;
    this.messageService.message(message);
    this.getCostHeadComponentDetails(this.projectId,this.costHead);
  }

  onDeleteCostHeadItemsFail(error : any) {
    console.log(error);
  }

  addItem() {
    console.log('addItems()');
    let quantity = {
      'item': '',
      'remarks': '',
      'nos': 0,
      'length': 0,
      'breadth': '-',
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

 getQuantityTotal(quantityItems : any) {
   for(let quantity in quantityItems) {
     this.quanitytNumbersTotal = this.quanitytNumbersTotal + quantityItems[quantity].nos;
     this.lengthTotal = this.lengthTotal + quantityItems[quantity].length;
     this.breadthTotal = this.breadthTotal + quantityItems[quantity].breadth;
     this.heightTotal = this.heightTotal + quantityItems[quantity].height;
     //quantityItems[quantity].length+=quantityItems[quantity].length;
     //console.log('length : '+quantityItems[quantity].length);
   }
   this.quantityTotal =this.lengthTotal * this.breadthTotal * this.heightTotal;
   console.log('Nos : '+this.quanitytNumbersTotal);
  }

  updateCostHeadWorkItem() {
    console.log('updateWorkItem()');
    console.log('this.quantityItemsArray-> '+this.quantityItemsArray);
    this.costHeadService.saveCostHeadItems(this.costHead,this.workItem,this.quantityItemsArray).subscribe(
      costHeadItemSave => this.onSaveCostHeadItemsSuccess(costHeadItemSave),
      error => this.onSaveCostHeadItemsFail(error)
    );
  }


  onSaveCostHeadItemsSuccess(costHeadItemSave : any) {
    this.quantityItemsArray=costHeadItemSave.data.item;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM;
    this.messageService.message(message);
    this.getCostHeadComponentDetails(this.projectId,this.costHead);
  }

  onSaveCostHeadItemsFail(error : any) {
    console.log(error);
  }



}
