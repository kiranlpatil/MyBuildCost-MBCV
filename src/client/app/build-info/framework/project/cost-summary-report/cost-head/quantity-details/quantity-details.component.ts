import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../../../model/category';
import { QuantityItem } from '../../../../model/quantity-item';
import { WorkItem } from '../../../../model/work-item';
import {Button, Label, Messages, ValueConstant} from '../../../../../../shared/constants';
import * as lodsh from 'lodash';
import { QuantityDetails } from '../../../../model/quantity-details';
import { Message, MessageService, SessionStorage, SessionStorageService } from '../../../../../../shared/index';
import { CostSummaryService } from '../../cost-summary.service';
import { LoaderService } from '../../../../../../shared/loader/loaders.service';
import { Rate } from '../../../../model/rate';

@Component({
  moduleId: module.id,
  selector: 'bi-quantity-details',
  templateUrl: 'quantity-details.component.html',
  styleUrls: ['quantity-details.component.css'],
})

export class QuantityDetailsComponent implements OnInit {

  @Input() quantityDetails : Array<QuantityDetails>;
  @Input() workItem : Array<WorkItem>;
  @Input() workItemsList : Array<WorkItem>;
  @Input() categoryDetails :  Array<Category>;
  @Input() categoryRateAnalysisId : number;
  @Input() workItemRateAnalysisId : number;
  @Input() baseUrl : string;

  @Output() categoriesTotalAmount = new EventEmitter<number>();
  @Output() refreshWorkItemList = new EventEmitter();

  workItemId : number;
  rateItemsArray : Rate;
  unit:string='';
  previousRateQuantity : number = 0;
  quantityIncrement : number = 1;

  currentFloorIndex : number;
  showInnerView : string;

  quantityItemsArray: any = {};
  workItemData: Array<WorkItem>;
  keyQuantity: string;
  quantityName: string;
  showQuantityTab : string = null;
  currentQuantityIndex : number;
  constructor(private costSummaryService: CostSummaryService, private messageService: MessageService,
              private loaderService: LoaderService) {
  }

   ngOnInit() {
    this.workItemData = this.workItem;

  }

  setQuantityNameForDelete(quantityName: string) {
    this.quantityName = quantityName;
  }

  deleteQuantityDetailsByName() {
    if(this.quantityName !== null && this.quantityName !== undefined && this.quantityName !== '') {
      this.loaderService.start();
      let costHeadId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
      this.costSummaryService.deleteQuantityDetailsByName(this.baseUrl, costHeadId, this.categoryRateAnalysisId,
        this.workItemRateAnalysisId, this.quantityName).subscribe(
        success => this.onDeleteQuantityDetailsByNameSuccess(success),
        error => this.onDeleteQuantityDetailsByNameFailure(error)
      );
    } else {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_ERROR_VALIDATION_QUANTITY_NAME_REQUIRED;
      this.messageService.message(message);
    }
  }

  onDeleteQuantityDetailsByNameSuccess(success: any) {
    for (let quantityIndex in this.quantityDetails) {
      if (this.quantityDetails[quantityIndex].name === this.quantityName) {
        this.quantityDetails.splice(parseInt(quantityIndex),1);
        break;
      }
    }
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_QUANTITY_DETAILS;
    this.messageService.message(message);
    this.refreshWorkItemList.emit();
    this.loaderService.stop();
  }

  onDeleteQuantityDetailsByNameFailure(error: any) {
    console.log('Delete Quantity error');
  }


  changeQuantityName(keyQuantity: string) {
    if(keyQuantity !== null && keyQuantity !== undefined && keyQuantity !== '') {
      this.keyQuantity = keyQuantity;
    }
  }

  getLabel() {
    return Label;
  }

  getButton() {
    return Button;
  }

  setCategoriesTotal( categoriesTotal : number) {
    this.categoriesTotalAmount.emit(categoriesTotal);
  }

  getQuantity(quantityDetail : QuantityDetails, floorIndex : number, showInnerView : string) {
    if(floorIndex !== this.currentFloorIndex || this.showInnerView !== showInnerView) {
      this.setFloorIndex(floorIndex);
      if(quantityDetail.quantityItems.length !== 0) {
        this.quantityItemsArray = lodsh.cloneDeep(quantityDetail.quantityItems);
        this.keyQuantity = quantityDetail.name;
      } else {
        this.quantityItemsArray = [];
        quantityDetail.name = this.keyQuantity;
      }
      this.showInnerView = this.getLabel().WORKITEM_QUANTITY_TAB;
    }else {
      this.showInnerView = null;
    }
  }

  /////
  setFloorIndex(floorIndex : number) {
    this.currentFloorIndex = floorIndex;
    console.log('Floor Index : '+floorIndex);
  }

  // Get Rate by quantity
  getRateByQuantity(floorIndex : number, costQuantity : number, showInnerView : string) {
    if(floorIndex !== this.currentFloorIndex || this.showInnerView !== showInnerView) {
      this.setFloorIndex(floorIndex);
      this.setWorkItemDataForRateView(this.workItemRateAnalysisId, this.workItem.rate);
      this.calculateQuantity(this.workItem,costQuantity);
      this.showInnerView =  this.getLabel().GET_RATE_BY_QUANTITY;
    } else {
      this.closeInnerView();
    }
  }

  closeInnerView() {
    this.showInnerView = null;
    this.setFloorIndex(-1);
  }

  setWorkItemDataForRateView(workItemId : number, rate : Rate) {
    this.workItemId = workItemId;
    this.rateItemsArray = lodsh.cloneDeep(rate);
    this.unit = lodsh.cloneDeep(rate.unit);
  }

  calculateQuantity(workItem : WorkItem, costQuantity : number) {
    this.previousRateQuantity = lodsh.cloneDeep(workItem.rate.quantity);
    this.rateItemsArray.quantity = costQuantity;
    this.quantityIncrement = this.rateItemsArray.quantity / this.previousRateQuantity;
    for (let rateItemsIndex = 0; rateItemsIndex < this.rateItemsArray.rateItems.length; rateItemsIndex++) {
      this.rateItemsArray.rateItems[rateItemsIndex].quantity = parseFloat((
        this.rateItemsArray.rateItems[rateItemsIndex].quantity *
        this.quantityIncrement).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
    }
  }
}
