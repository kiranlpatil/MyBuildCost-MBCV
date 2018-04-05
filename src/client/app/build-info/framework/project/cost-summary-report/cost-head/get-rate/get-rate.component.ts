import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Messages, Button, TableHeadings, Label, Headings, ValueConstant} from '../../../../../../shared/constants';
import {
  SessionStorage, SessionStorageService,
  Message, MessageService
} from '../../../../../../shared/index';
import { CostSummaryService } from './../../cost-summary.service';
import { Rate } from '../../../../model/rate';
import { LoaderService } from '../../../../../../shared/loader/loaders.service';
import { WorkItem } from '../../../../model/work-item';
import { Category } from '../../../../model/category';
import { CommonService } from '../../../../../../../app/shared/services/common.service';
import { RateItem } from '../../../../model/rate-item';


@Component({
  moduleId: module.id,
  selector: 'bi-get-rate',
  templateUrl: 'get-rate.component.html',
  styleUrls: ['get-rate.component.css'],
})

export class GetRateComponent {

  @Input() rate: Rate;
  @Input() categoryDetails :  Array<Category>;
  @Input() categoryRateAnalysisId : number;
  @Input() workItemRateAnalysisId : number;
  @Input() workItemsList : Array<WorkItem>;
  @Input() totalAmount: number;
  @Input() baseUrl : string;
  @Input() rateView: string;
  @Input() disableRateField: boolean;

  @Output() categoriesTotalAmount = new EventEmitter<number>();
  @Output() showWorkItemTabName = new EventEmitter<string>();
  @Output() refreshCategoryList = new EventEmitter();
  @Output() closeRateView = new EventEmitter();

  quantityIncrement: number = 1;
  previousTotalQuantity: number = 1;
  totalItemRateQuantity: number = 0;
  arrayOfRateItems: Array<RateItem>;
  selectedRateItem:RateItem;
  selectedRateItemIndex:number;

  constructor(private costSummaryService: CostSummaryService,  private loaderService: LoaderService,
              private messageService: MessageService, private commonService: CommonService) {
  }

  calculateTotal(choice?:string) {
    this.totalAmount = 0;

    for (let i = 0; i < this.rate.rateItems.length; i++) {

      if(choice === 'changeTotalQuantity') {
        this.rate.rateItems[i].quantity = this.commonService.decimalConversion(this.rate.rateItems[i].quantity *
          this.quantityIncrement);
      }

      this.rate.rateItems[i].totalAmount = this.commonService.decimalConversion(this.rate.rateItems[i].quantity*
        this.rate.rateItems[i].rate);

      this.totalAmount = this.commonService.decimalConversion(this.totalAmount +
        this.rate.rateItems[i].totalAmount);

    }

this.rate.total = this.commonService.decimalConversion(this.totalAmount / this.rate.quantity);
  }

  updateRate(rateItemsArray: Rate) {
    this.loaderService.start();
     let costHeadId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
    let workItemId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID));

    let rate = new Rate();
    rate.rateFromRateAnalysis = rateItemsArray.rateFromRateAnalysis;
    rate.total = this.commonService.decimalConversion(rateItemsArray.total);
    rate.quantity = rateItemsArray.quantity;
    rate.unit = rateItemsArray.unit;
    rate.rateItems = rateItemsArray.rateItems;
    rate.imageURL=rateItemsArray.imageURL;
    rate.notes=rateItemsArray.notes;

    this.costSummaryService.updateRate( this.baseUrl, costHeadId, this.categoryRateAnalysisId, workItemId, rate).subscribe(
      success => this.onUpdateRateSuccess(success),
      error => this.onUpdateRateFailure(error)
    );
  }

  onUpdateRateSuccess(success : string) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_RATE;
    this.messageService.message(message);

    for(let workItemData of this.workItemsList) {
      if(workItemData.rateAnalysisId === this.workItemRateAnalysisId) {
        workItemData.rate.total = this.commonService.decimalConversion(this.totalAmount /
          workItemData.rate.quantity);
        if(workItemData.rate.total !== 0) {
          workItemData.rate.isEstimated = true;
          if(workItemData.quantity.isEstimated && workItemData.rate.isEstimated) {
            workItemData.amount = this.commonService.calculateAmountOfWorkItem(workItemData.quantity.total,
              workItemData.rate.total);
          }
        } else {
          workItemData.rate.isEstimated = false;
          workItemData.amount = 0;
        }
        break;
      }
    }

    let categoriesTotal= this.commonService.totalCalculationOfCategories(this.categoryDetails,
      this.categoryRateAnalysisId, this.workItemsList);
    this.categoriesTotalAmount.emit(categoriesTotal);

    this.showWorkItemTabName.emit('');
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
        this.rate.quantity = newTotalQuantity;
        var message = new Message();
        message.isError = false;
        message.custom_message = Messages.MSG_QUANTITY_SHOULD_NOT_ZERO_OR_NULL;
        this.messageService.message(message);

    } else {
          this.quantityIncrement = newTotalQuantity / this.previousTotalQuantity;
          this.calculateTotal('changeTotalQuantity');
          this.totalItemRateQuantity = newTotalQuantity;
          this.rate.quantity = newTotalQuantity;
    }

  }

  getPreviousQuantity(previousTotalQuantity: number) {
    this.previousTotalQuantity = previousTotalQuantity;
  }

  getRateItemsByOriginalName(rateItem: any, index:number) {
    this.selectedRateItem = rateItem;
    this.selectedRateItemIndex = index;

    this.costSummaryService.getRateItemsByOriginalName( this.baseUrl,rateItem.originalItemName).subscribe(
      rateItemsData => this.onGetRateItemsByOriginalNameSuccess(rateItemsData.data),
      error => this.onGetRateItemsByOriginalNameFailure(error)
    );
  }

  onGetRateItemsByOriginalNameSuccess(rateItemsData: any) {
    this.arrayOfRateItems = rateItemsData;

    for(let rateItemData of rateItemsData) {
      if(rateItemData.itemName === this.selectedRateItem.itemName) {
         this.rate.rateItems[this.selectedRateItemIndex].rate = rateItemData.rate;
        this.calculateTotal();
      }
    }
    for(let workItemData of this.workItemsList) {
      if(workItemData.rateAnalysisId === this.workItemRateAnalysisId) {
        workItemData.rate = this.rate;
      }
    }
  }

  closeRateTab() {
    this.closeRateView.emit();
  }

  onGetRateItemsByOriginalNameFailure(error: any) {
    console.log(error);
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
