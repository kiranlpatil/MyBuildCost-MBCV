import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Messages } from '../../../../../../shared/constants';
import {
  SessionStorage, SessionStorageService,
  Message, MessageService
} from '../../../../../../shared/index';
import { CostSummaryService } from './../../cost-summary.service';
import { Rate } from '../../../../model/rate';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-get-rate',
  templateUrl: 'get-rate.component.html',
  styleUrls: ['get-rate.component.css'],
})

export class GetRateComponent {

  @Input() rateItemsArray: Rate;
  @Input() subCategoryRateAnalysisId: number;
  @Input() totalQuantity: number;
  @Input() totalAmount: number;
  @Input() totalRate: number;
  @Output() refreshSubCategoryList = new EventEmitter();

  quantityIncrement: number = 1;
  previousTotalQuantity: number = 1;
  totalItemRateQuantity: number = 0;

  constructor(private costSummaryService: CostSummaryService, private messageService: MessageService) {
  }

  calculateTotal(choice?:string) {
    this.totalAmount = 0;
    this.totalRate = 0.0;
    this.totalQuantity = 0.0;
    for (let i = 0; i < this.rateItemsArray.rateItems.length; i++) {
      if(choice === 'changeTotalQuantity') {
        this.rateItemsArray.rateItems[i].quantity =parseFloat((this.rateItemsArray.rateItems[i].quantity *
          this.quantityIncrement).toFixed(2));
      }
      this.rateItemsArray.rateItems[i].totalAmount=parseFloat((this.rateItemsArray.rateItems[i].quantity*
        this.rateItemsArray.rateItems[i].rate).toFixed(2));
      this.totalAmount = parseFloat((this.totalAmount + (this.rateItemsArray.rateItems[i].quantity *
        this.rateItemsArray.rateItems[i].rate)).toFixed(2));
      this.totalRate = parseFloat((this.totalRate + this.rateItemsArray.rateItems[i].rate).toFixed(2));
      this.totalQuantity = parseFloat((this.totalQuantity + this.rateItemsArray.rateItems[i].quantity).toFixed(2));
    }

    this.rateItemsArray.total = parseFloat((this.totalAmount / this.totalQuantity).toFixed(2));
  }

  updateRate(rateItemsArray: Rate) {
    let costHeadId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID);
    let workItemId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID);
    let rate = new Rate();
    rate.rateFromRateAnalysis = rateItemsArray.rateFromRateAnalysis;
    rate.total = parseFloat((rateItemsArray.total).toFixed(2));
    rate.quantity = rateItemsArray.quantity;
    rate.unit = rateItemsArray.unit;
    rate.rateItems = rateItemsArray.rateItems;

    this.costSummaryService.updateRate(parseInt(costHeadId), this.subCategoryRateAnalysisId,
      parseInt(workItemId), rate).subscribe(
      rateItem => this.onUpdateRateSuccess(rateItem),
      error => this.onUpdateRateFailure(error)
    );
  }

  onUpdateRateSuccess(rateItem: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_RATE;
    this.messageService.message(message);
    this.refreshSubCategoryList.emit();
  }

  onUpdateRateFailure(error: any) {
    console.log(error);
  }

  onTotalQuantityChange(newTotalQuantity: number) {
    if (newTotalQuantity === 0 || newTotalQuantity === null) {
      newTotalQuantity=1;
      this.totalItemRateQuantity = newTotalQuantity;
      this.rateItemsArray.quantity = newTotalQuantity;
    } else {
      this.quantityIncrement = newTotalQuantity / this.previousTotalQuantity;
      this.calculateTotal('changeTotalQuantity');
      this.totalItemRateQuantity = newTotalQuantity;
      this.rateItemsArray.quantity = newTotalQuantity;
    }

  }

  getPreviousQuantity(previousTotalQuantity: number) {
    this.previousTotalQuantity = previousTotalQuantity;
  }

}
