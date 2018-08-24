import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../../../../shared/index';
import { QuantityItem } from '../../../../model/quantity-item';
import { CostSummaryService } from '../../cost-summary.service';
import {
  ProjectElements, Button, TableHeadings, Label, Headings,
  ValueConstant
} from '../../../../../../shared/constants';
import { LoaderService } from '../../../../../../shared/loader/loaders.service';
import { Category } from '../../../../model/category';
import { WorkItem } from '../../../../model/work-item';
import { Router } from '@angular/router';
import { CommonService } from '../../../../../../../app/shared/services/common.service';
import { QuantityDetails } from '../../../../model/quantity-details';
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'bi-get-quantity',
  templateUrl: 'get-quantity.component.html',
  styleUrls: ['get-quantity.component.css'],
})

export class GetQuantityComponent implements OnInit {
  @Input() quantityItems :  Array<QuantityItem>;
  @Input() quantityDetails :  Array<QuantityDetails>;
  @Input() categoryDetails :  Array<Category>;
  @Input() categoryRateAnalysisId : number;
  @Input() workItemRateAnalysisId : number;
  @Input() ccWorkItemId : number;
  @Input() workItemsList : Array<WorkItem>;
  @Input() baseUrl : string;
  @Input() workItemUnit : string;
  @Input() keyQuantity : string;
  @Input() quantityId : number;
  @Input() innerView: string;
  @Input() workItem ?: WorkItem;


  @Output() closeQuantityView = new EventEmitter();
  @Output() closeInnerView = new EventEmitter();
  @Output() categoriesTotalAmount = new EventEmitter<number>();

  projectId : string;
  buildingId: string;
  workItemId: number;
  quantityIndex: number;
  quantityTotal: number = 0;
  quantityNumbersTotal: number = 0;
  lengthTotal: number = 0;
  breadthTotal: number = 0;
  heightTotal: number = 0;

  constructor(private costSummaryService : CostSummaryService,  private loaderService: LoaderService,
              private messageService: MessageService, private _router : Router, private commonService: CommonService) {
  }

  ngOnInit() {
    if(this.quantityItems.length === 0) {
      for(let i =0; i<5; i++) {
        this.addQuantityItem();
      }
    }
   this.getQuantityTotal(this.quantityItems);
   this.workItemId = parseFloat(SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID));
    }

  getQuantityTotal(quantityItems : any) {
    this.quantityTotal = 0;
    this.quantityItems = quantityItems;

    for(let quantityIndex in this.quantityItems) {
      var number = this.quantityItems[quantityIndex].nos;
      var length = this.quantityItems[quantityIndex].length;
      var height = this.quantityItems[quantityIndex].height;
      var breadth = this.quantityItems[quantityIndex].breadth;
      if (this.validateQuantityItems(number, length, height, breadth)) {

        this.quantityItems[quantityIndex].quantity = this.commonService.decimalConversion(number * (this.workItem.length ? length : 1) *
          (this.workItem.breadthOrWidth ? breadth : 1) * (this.workItem.height ? height : 1));
        this.quantityTotal = this.commonService.decimalConversion(this.quantityTotal +
          this.quantityItems[quantityIndex].quantity);
      }else {
        this.quantityItems[quantityIndex].quantity=0;
        var message = new Message();
        message.isError = true;
        message.error_msg = this.getMessages().AMOUNT_VALIDATION_MESSAGE;
        this.messageService.message(message);
      }
    }
  }
validateQuantityItems(number:number,length:number,height:number,breadth:number) {
    if(number===null || length===null || height===null ||breadth===null) {
     return true;
  }
    if( number.toString().match(/^\d{1,7}(\.\d{1,2})?$/) &&
       length.toString().match(/^\d{1,7}(\.\d{1,2})?$/)&&
       height.toString().match(/^\d{1,7}(\.\d{1,2})?$/)&&
      breadth.toString().match(/^\d{1,7}(\.\d{1,2})?$/)) {
      return true;
    }
    return false;
}
  addQuantityItem() {
    let quantity = new QuantityItem();
    quantity.item = '';
    quantity.remarks = '';
    quantity.nos = 0;
    quantity.length = 0;
    quantity.breadth = 0;
    quantity.height = 0;
    quantity.quantity = 0;
    quantity.unit = 'sqft';
    this.quantityItems.push(quantity);
  }

  updateQuantityItem(quantityItems : Array<QuantityItem>) {
    if($('input').hasClass('validate-amount') ) {
      var message = new Message();
      message.isError = true;
      message.error_msg = this.getMessages().AMOUNT_VALIDATION_MESSAGE;
      this.messageService.message(message);
      return;
    }
    if((this.keyQuantity !== '' && this.keyQuantity !== null && this.keyQuantity !== undefined)) {
      let quantityItemsArray = this.validateQuantityItem(quantityItems);
      let quantityObj : QuantityDetails = new QuantityDetails();
      quantityObj.id = this.quantityId;
      quantityObj.name = this.keyQuantity;
      quantityObj.quantityItems = quantityItemsArray;
      quantityObj.total = this.quantityTotal;
      this.loaderService.start();
      let costHeadId = parseFloat(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
      this.costSummaryService.updateQuantityItems(this.baseUrl, costHeadId, this.categoryRateAnalysisId,
        this.workItemId, this.ccWorkItemId, quantityObj).subscribe(
        success => this.onUpdateQuantityItemsSuccess(success),
        error => this.onUpdateQuantityItemsFailure(error)
      );
    } else {
     let message = new Message();
      message.isError = true;
      message.error_msg = Messages.MSG_ERROR_VALIDATION_QUANTITY_NAME_REQUIRED;
      this.messageService.message(message);
    }
  }

  validateQuantityItem(quantityItems : Array<QuantityItem>) {
    for (let quantityItemIndex =quantityItems.length-1; quantityItemIndex >=0;  quantityItemIndex--) {
      if (quantityItems[quantityItemIndex].item === '' || quantityItems[quantityItemIndex].item === undefined) {
        quantityItems.splice(quantityItemIndex,1);
      }
    }
    return quantityItems;
  }

  onUpdateQuantityItemsSuccess(success : string) {

    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM;
    this.messageService.message(message);

    let workItemId = this.workItemId;
    let workItemData = this.workItemsList.filter(
      function( workItemData: any){
        return workItemData.rateAnalysisId === workItemId;
      });

   // this.commonService.calculateTotalOfQuantityItemDetails(workItemData[0]);

      if(workItemData[0].quantity.total !== 0) {
        workItemData[0].quantity.isEstimated = true;
        if(workItemData[0].quantity.isEstimated && workItemData[0].rate.isEstimated) {
          workItemData[0].amount = this.commonService.calculateAmountOfWorkItem(workItemData[0].quantity.total,
            workItemData[0].rate.total);
        }
      } else {
        workItemData[0].quantity.isEstimated = false;
        workItemData[0].amount = 0;
      }

    let categoriesTotal= this.commonService.totalCalculationOfCategories(this.categoryDetails,
    this.categoryRateAnalysisId, this.workItemsList);
    this.categoriesTotalAmount.emit(categoriesTotal);
    this.loaderService.stop();
    this.closeQuantityTab();
  }

  onUpdateQuantityItemsFailure(error: any) {
    var message = new Message();
    message.isError = true;
    message.error_msg = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
    this.loaderService.stop();
  }

  setQuantityItemNameForDelete(quantityIndex: number) {
     this.quantityIndex= quantityIndex;
  }

  deleteQuantityItem(quantityIndex: number) {

     this.quantityIndex= quantityIndex;
     this.quantityItems.splice(this.quantityIndex,1);
     var message = new Message();
     message.isError = false;
     message.custom_message = Messages.MSG_SUCCESS_DELETE_QUANTITY_ITEM;
     this.messageService.message(message);
     this.getQuantityTotal(this.quantityItems);
      }

  closeQuantityTab() {
    this.closeQuantityView.emit('');
  }

  closeInnerViewTab() {
    this.closeInnerView.emit();
  }

  getButton() {
    return Button;
  }

  getTableHeadings() {
    return TableHeadings;
  }

  getLabel() {
    return Label;
  }

  getHeadings() {
    return Headings;
  }
  getMessages() {
    return Messages;
  }
}
