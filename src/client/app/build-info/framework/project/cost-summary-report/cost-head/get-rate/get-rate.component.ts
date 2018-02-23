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

  @Input() rateItemsArray: any;
  @Input() rateItemsObject: any;
  @Input() subCategoryRateAnalysisId: number;
  @Input() totalQuantity: number;
  @Input() totalAmount: number;
  @Input() totalRate: number;
  @Output() refreshSubCategoryList = new EventEmitter();

  projectId: string;
  buildingId: string;

  costHead: string;
  costheadId: number;
  subCategoryId: number;

  total: number = 0;
  quantity: number = 0;
  quantityIncrement: number = 1;
  previousTotalQuantity: number = 1;
  totalItemRateQuantity: number = 0;

  constructor(private costSummaryService: CostSummaryService, private messageService: MessageService) {
  }

  changeQuantity(quantity: any, k: number) {
    this.rateItemsArray.items[k].quantity = parseFloat(quantity);
    this.calculateTotal('changeQuantity');
  }

  changeRate(rate: any, k: number) {
    this.rateItemsArray.items[k].rate = parseFloat(rate);
    this.calculateTotal('changeRate');
  }

  calculateTotal(choice:string) {
    this.totalAmount = 0;
    this.totalRate = 0.0;
    this.totalQuantity = 0.0;
    for (let i = 0; i < this.rateItemsArray.items.length; i++) {
      if(choice === 'changeTotalQuantity') {
        this.rateItemsArray.items[i].quantity = this.rateItemsArray.items[i].quantity * this.quantityIncrement;
      }
      this.totalAmount = this.totalAmount + (this.rateItemsArray.items[i].quantity * this.rateItemsArray.items[i].rate);
      this.totalRate = this.totalRate + this.rateItemsArray.items[i].rate;
      this.totalQuantity = this.totalQuantity + this.rateItemsArray.items[i].quantity;
    }

    this.rateItemsArray.total = parseFloat((this.totalAmount / this.totalQuantity).toFixed(2));
  }

  updateRate(rateItemsArray: any) {
    let costHeadId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID);
    let workItemId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID);
    let rate = new Rate();
    rate.rateFromRateAnalysis = parseFloat(rateItemsArray.rateFromRateAnalysis);
    rate.total = parseFloat((rateItemsArray.total).toFixed(2));
    rate.quantity = rateItemsArray.quantity;
    rate.unit = rateItemsArray.unit;
    rate.items = rateItemsArray.items;

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
