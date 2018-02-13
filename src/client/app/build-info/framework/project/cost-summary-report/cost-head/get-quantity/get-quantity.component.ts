import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';

import {
  AppSettings,
  Label,
  Button,
  Headings,
  NavigationRoutes
} from '../../../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService,  Message,
  Messages, MessageService } from '../../../../../../shared/index';

import { GetQuantityService } from './get-quantity.service';
import Rate = require('../../../../../../../../server/app/applicationProject/dataaccess/model/Rate');

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-get-quantity',
  templateUrl: 'get-quantity.component.html',
  styleUrls: ['get-quantity.component.css'],
})

export class GetQuantityComponent implements OnInit {
  @Input() quantityItems : any;
  @Input() subCategoryRateAnalysisId : number;
  @Output() refreshDataList = new EventEmitter();

  projectId : string;
  buildingId: string;
  buildingName: string;
  itemName: string;
  costHead: string;
  costheadId:number;
  subCategoryId: number;
  subCategoryDetails: any;
  quantityTotal: number = 0;
  quanitytNumbersTotal: number = 0;
  lengthTotal: number = 0;
  breadthTotal: number = 0;
  heightTotal: number = 0;
  totalAmount:number=0;
  totalRate:number=0;
  totalQuantity:number=0;
  total:number=0;
  quantity:number=0;
  unit:string='';
  workItemId:number;
  showSubcategoryListvar: boolean = false;
  private quantityItemsArray: any;
  private showWorkItemList:boolean=false;

  constructor(private getQuantityService : GetQuantityService, private activatedRoute : ActivatedRoute, private messageService: MessageService) {
  }

  ngOnInit() {
    console.log('quantityItems : '+JSON.stringify(this.quantityItems));
  }

  onSubmit() {
  }

  getNo(quantityItems : any) {
    this.quanitytNumbersTotal =0;
    for(let i=0;i<this.quantityItems.length;i++) {
      this.quanitytNumbersTotal= this.quanitytNumbersTotal +this.quantityItems[i].nos;
    }
  }

  getLength(quantityItems : any) {
    this.lengthTotal = 0;
    for (let i = 0; i < this.quantityItems.length; i++) {
      this.lengthTotal = this.lengthTotal + this.quantityItems[i].length;
    }
    this.updateQuantity(this.quantityItems);
  }

  getBreadth(quantityItems : any) {
    this.breadthTotal= 0;
    for(let i=0;i<this.quantityItems.length;i++) {
      this.breadthTotal = this.breadthTotal +this.quantityItems[i].breadth;
    }
    this.updateQuantity(this.quantityItems);
  }

  getHeight(quantityItems: any) {
    this.heightTotal=0;
    for(let i=0;i<this.quantityItems.length;i++) {
      this.heightTotal = this.heightTotal +this.quantityItems[i].height;
    }
    this.updateQuantity(this.quantityItems);
  }

  updateQuantity(quantityItems : any) {
    this.quantityTotal = 0;
    this.quantityItems = quantityItems;
    for(let i=0;i<this.quantityItems.length;i++) {
      if(this.quantityItems[i].length === undefined || this.quantityItems[i].length === 'NAN' || this.quantityItems[i].length === null) {
        var q1 = this.quantityItems[i].height;
        var q2 = this.quantityItems[i].breadth;
      } else if(this.quantityItems[i].height === undefined || this.quantityItems[i].height === 'NAN' || this.quantityItems[i].height === null) {
        q1 = this.quantityItems[i].length;
        q2 = this.quantityItems[i].breadth;
      } else if(this.quantityItems[i].breadth === undefined || this.quantityItems[i].breadth === 'NAN' || this.quantityItems[i].breadth === null) {
        q1 = this.quantityItems[i].length;
        q2 = this.quantityItems[i].height;
      } else {
        q1 = this.quantityItems[i].length;
        q2 = this.quantityItems[i].breadth;
        // q3 = this.quantityItems[i].height;
      }
      this.quantityItems[i].quantity = q1 * q2;
      this.quantityTotal = this.quantityTotal + this.quantityItems[i].quantity;
    }
  }

  getQuantityTotal(quantityItems : any) {
    this.updateQuantity(quantityItems);
    this.getHeight(quantityItems);
    this.getLength(quantityItems);
    this.getNo(quantityItems);
    this.getBreadth(quantityItems);
  }


  getCostHeadQuantityDetails() {
    console.log('Getting qunaity');
  }

  addItem() {
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
    this.quantityItems.push(quantity);
  }

    updateCostHeadWorkItem(quantityItems : any) {
    let costHeadId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID);
    let workItemId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID);

    this.getQuantityService.saveCostHeadItems(parseInt(costHeadId), this.subCategoryRateAnalysisId,
      parseInt(workItemId), quantityItems).subscribe(
      costHeadItemSave => this.onSaveCostHeadItemsSuccess(costHeadItemSave),
      error => this.onSaveCostHeadItemsFail(error)
    );
  }
  onSaveCostHeadItemsSuccess(costHeadItemSave: any) {
    this.quantityItems = costHeadItemSave.data.item;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM;
    this.messageService.message(message);
    this.refreshDataList.emit();
    //this.getCostHeadComponentDetails(this.projectId, this.costHead);
  }

  onSaveCostHeadItemsFail(error: any) {
    var message = new Message();
    message.isError = true;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
  }
  setQuantityItemName(itemName: string) {
    this.itemName = itemName;
  }
  deleteQuantityItemfun() {
    let costHeadId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID);
    let workItemId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID);
    this.getQuantityService.deleteQuantityItem(parseInt(costHeadId), this.subCategoryRateAnalysisId,
      parseInt(workItemId), this.itemName).subscribe(
      costHeadItemDelete => this.onDeleteQuantityItemSuccess(costHeadItemDelete),
      error => this.onDeleteQuantityItemFail(error)
    );
  }
  onDeleteQuantityItemSuccess(costHeadItemDelete: any) {
    this.quantityItems = costHeadItemDelete.data.item;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_ITEM;
    this.messageService.message(message);
    this.getQuantityTotal(this.quantityItems);
    // this.getCostHeadComponentDetails(this.projectId, this.costHead);
  }

  onDeleteQuantityItemFail(error: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
  }

}
