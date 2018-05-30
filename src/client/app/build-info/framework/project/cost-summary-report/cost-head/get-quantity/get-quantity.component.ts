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
      this.addQuantityItem();
    }
    this.updateAllQuantity();
   this.workItemId = parseFloat(SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID));
    }

    updateQuantity(choice:string ) {
    switch(choice) {
      case 'updateNos': {
        this.quantityNumbersTotal =0;
        for(let quantityIndex in this.quantityItems) {
          this.quantityNumbersTotal= this.commonService.decimalConversion(this.quantityNumbersTotal +
            this.quantityItems[quantityIndex].nos);
        }
        this.getQuantityTotal(this.quantityItems);
      }
        break;
      case 'updateLength': {
        this.lengthTotal = 0;
        for(let quantityIndex in this.quantityItems)  {
          this.lengthTotal = this.commonService.decimalConversion(this.lengthTotal +
            this.quantityItems[quantityIndex].length);
        }
        this.getQuantityTotal(this.quantityItems);
      }
        break;
      case 'updateBreadth' : {
        this.breadthTotal= 0;
        for(let quantityIndex in this.quantityItems)  {
          this.breadthTotal = this.commonService.decimalConversion(this.breadthTotal +
            this.quantityItems[quantityIndex].breadth);
        }
        this.getQuantityTotal(this.quantityItems);
      }
        break;
      case 'updateHeight' : {
        this.heightTotal=0;
        for(let quantityIndex in this.quantityItems)  {
          this.heightTotal = this.commonService.decimalConversion(this.heightTotal +
            this.quantityItems[quantityIndex].height);
        }
        this.getQuantityTotal(this.quantityItems);
      }
        break;
    }
  }

  getQuantityTotal(quantityItems : any) {
    this.quantityTotal = 0;
    this.quantityItems = quantityItems;

    for(let quantityIndex in this.quantityItems) {
      var number = this.quantityItems[quantityIndex].nos;
      var length = this.quantityItems[quantityIndex].length;
      var height = this.quantityItems[quantityIndex].height;
      var breadth =this.quantityItems[quantityIndex].breadth;

      this.quantityItems[quantityIndex].quantity = this.commonService.decimalConversion( number * (this.workItem.length?length:1)*
        (this.workItem.breadthOrWidth?breadth:1)*(this.workItem.height?height:1) );
      this.quantityTotal = this.commonService.decimalConversion(this.quantityTotal +
        this.quantityItems[quantityIndex].quantity);
      }

  }

  updateAllQuantity() {
    this.updateQuantity('updateNos');
    this.updateQuantity('updateLength');
    this.updateQuantity('updateBreadth');
    this.updateQuantity('updateHeight');
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

    if(this.validateQuantityItem(quantityItems) && (this.keyQuantity !== ''
        && this.keyQuantity !== null && this.keyQuantity !== undefined)) {

      let quantityObj : QuantityDetails = new QuantityDetails();
      quantityObj.id = this.quantityId;
      quantityObj.name = this.keyQuantity;
      quantityObj.quantityItems = quantityItems;
      this.loaderService.start();
      let costHeadId = parseFloat(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
      this.costSummaryService.updateQuantityItems(this.baseUrl, costHeadId, this.categoryRateAnalysisId,
        this.workItemId, quantityObj).subscribe(
        success => this.onUpdateQuantityItemsSuccess(success),
        error => this.onUpdateQuantityItemsFailure(error)
      );
    } else {
      var message = new Message();
      message.isError = true;
      if(this.keyQuantity !== null && this.keyQuantity !== undefined) {
        message.error_msg = Messages.MSG_ERROR_VALIDATION_QUANTITY_REQUIRED;
      } else {
        message.error_msg = Messages.MSG_ERROR_VALIDATION_QUANTITY_NAME_REQUIRED;
      }
      this.messageService.message(message);
    }
  }

  validateQuantityItem(quantityItems : Array<QuantityItem>) {
    for(let quantityItemData of quantityItems) {
      if((quantityItemData.item === '' || quantityItemData.item === undefined ||  quantityItemData.item.trim() === '') ||
        (quantityItemData.nos === undefined || quantityItemData.nos === null) ||
        (quantityItemData.length === undefined || quantityItemData.length === null) ||
        (quantityItemData.height === undefined || quantityItemData.height === null)) {
        return false;
      }
    }
    return true;
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

    this.commonService.calculateTotalOfQuantityItemDetails(workItemData[0]);

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
     this.updateAllQuantity();
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
}
