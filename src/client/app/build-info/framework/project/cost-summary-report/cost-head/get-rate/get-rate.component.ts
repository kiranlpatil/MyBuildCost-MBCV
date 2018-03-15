import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Messages, Button, TableHeadings, Label, Headings, ValueConstant} from '../../../../../../shared/constants';
import {
  SessionStorage, SessionStorageService,
  Message, MessageService
} from '../../../../../../shared/index';
import { CostSummaryService } from './../../cost-summary.service';
import { Rate } from '../../../../model/rate';
import { LoaderService } from '../../../../../../shared/loader/loaders.service';

@Component({
  moduleId: module.id,
  selector: 'bi-get-rate',
  templateUrl: 'get-rate.component.html',
  styleUrls: ['get-rate.component.css'],
})

export class GetRateComponent {

  @Input() rateItemsArray: Rate;
  @Input() categoryRateAnalysisId: number;
  @Input() totalAmount: number;
  @Input() rateView: string;
  @Input() disableRateField: boolean;
  @Output() refreshCategoryList = new EventEmitter();

  quantityIncrement: number = 1;
  previousTotalQuantity: number = 1;
  totalItemRateQuantity: number = 0;

  constructor(private costSummaryService: CostSummaryService,  private loaderService: LoaderService,
              private messageService: MessageService) {
  }

  calculateTotal(choice?:string) {
    this.totalAmount = 0;

    for (let i = 0; i < this.rateItemsArray.rateItems.length; i++) {

      if(choice === 'changeTotalQuantity') {
        this.rateItemsArray.rateItems[i].quantity = parseFloat((this.rateItemsArray.rateItems[i].quantity *
          this.quantityIncrement).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
      }

      this.rateItemsArray.rateItems[i].totalAmount = parseFloat((this.rateItemsArray.rateItems[i].quantity*
        this.rateItemsArray.rateItems[i].rate).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

      this.totalAmount = parseFloat((this.totalAmount + (this.rateItemsArray.rateItems[i].quantity *
        this.rateItemsArray.rateItems[i].rate)).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

    }

    this.rateItemsArray.total = parseFloat((this.totalAmount / this.rateItemsArray.quantity).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
  }

  updateRate(rateItemsArray: Rate) {
    this.loaderService.start();
    let projectID= SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let costHeadId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
    let workItemId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID));

    let rate = new Rate();
    rate.rateFromRateAnalysis = rateItemsArray.rateFromRateAnalysis;
    rate.total = parseFloat((rateItemsArray.total).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
    rate.quantity = rateItemsArray.quantity;
    rate.unit = rateItemsArray.unit;
    rate.rateItems = rateItemsArray.rateItems;
    rate.imageURL=rateItemsArray.imageURL;
    rate.notes=rateItemsArray.notes;

    this.costSummaryService.updateRate( projectID, buildingId, costHeadId, this.categoryRateAnalysisId, workItemId, rate).subscribe(
      rateItem => this.onUpdateRateSuccess(rateItem),
      error => this.onUpdateRateFailure(error)
    );
  }

  onUpdateRateSuccess(rateItem: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_RATE;
    this.messageService.message(message);
    this.refreshCategoryList.emit();
    this.loaderService.stop();
  }

  onUpdateRateFailure(error: any) {
    console.log(error);
    this.loaderService.stop();
  }

  onTotalQuantityChange(newTotalQuantity: number) {

    if (newTotalQuantity === 0 || newTotalQuantity === null) {

        newTotalQuantity=1;
        this.totalItemRateQuantity = newTotalQuantity;
        this.rateItemsArray.quantity = newTotalQuantity;
        var message = new Message();
        message.isError = false;
        message.custom_message = Messages.MSG_QUANTITY_SHOULD_NOT_ZERO_OR_NULL;
        this.messageService.message(message);

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
