import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import {
  Messages, Button, TableHeadings, Label, Headings, ValueConstant,
  StandardNotes, ProjectElements
} from '../../../../../../shared/constants';
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
import { ErrorService } from '../../../../../../shared/services/error.service';
import {UpdateSubscriptionStatusService} from "../../../../../../shared/services/update-subscription-status.service";
declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'bi-get-rate',
  templateUrl: 'get-rate.component.html',
  styleUrls: ['get-rate.component.css'],
})

export class GetRateComponent implements OnChanges {

  @Input() rate: Rate;
  @Input() categoryDetails :  Array<Category>;
  @Input() categoryRateAnalysisId : number;
  @Input() workItemRateAnalysisId : number;
  @Input() ccWorkItemId : number;
  @Input() workItemsList : Array<WorkItem>;
  @Input() workItemUnit :any;
  @Input() totalByUnit :number;
  @Input() ratePerUnitAmount : number;
  @Input() baseUrl : string;
  @Input() rateView: string;
  @Input() disableRateField: boolean;
  @Input() innerView: string;

  @Input() displayDisclaimar: boolean;

  @Output() categoriesTotalAmount = new EventEmitter<number>();
  @Output() refreshCategoryList = new EventEmitter();
  @Output() closeRateView = new EventEmitter();
  @Output() closeInnerView = new EventEmitter();

  totalAmount : number = 0;
  totalAmountOfMaterial : number = 0;
  totalAmountOfLabour : number = 0;
  totalAmountOfMaterialAndLabour : number = 0;
  quantityIncrement: number = 1;
  previousTotalQuantity: number = 1;
  totalItemRateQuantity: number = 0;
  arrayOfRateItems: Array<RateItem>;
  selectedRateItem:RateItem;
  selectedRateItemIndex:number;
  selectedRateItemKey : string;
  type : string;
  selectedItemName: string;
  anySubscriptionAvailable : boolean;
  subscription :any;
  //totalByUnit :  number = 0;

  constructor(private costSummaryService: CostSummaryService,  private loaderService: LoaderService,
              private messageService: MessageService, private commonService: CommonService,
              private errorService:ErrorService,private updateSubscriptionStatusService:UpdateSubscriptionStatusService) {
    this.subscription = this.updateSubscriptionStatusService.changeSubscriptionStatus$.subscribe(
      (isAnySubscriptionAvailable:boolean )=> {
        this.anySubscriptionAvailable= isAnySubscriptionAvailable;}
    );
  }

  ngOnChanges() {
    console.log(this.rate);
    this.calculateTotal();
  }

  calculateTotal(choice?:string) {
    this.totalByUnit = 0;
    this.ratePerUnitAmount = 0;
    this.totalAmount = 0;
    this.totalAmountOfLabour = 0;
    this.totalAmountOfMaterial=0;
    this.totalAmountOfMaterialAndLabour = 0;

    for (let rateItemsIndex in this.rate.rateItems) {
     if(this.rate.rateItems[rateItemsIndex].quantity!==null && this.rate.rateItems[rateItemsIndex].rate !==null &&
       !this.validateMeasurementSheetItems(this.rate.rateItems[rateItemsIndex].quantity,this.rate.rateItems[rateItemsIndex].rate)) {
       this.rate.rateItems[rateItemsIndex].totalAmount=0;
      continue;
     }
      if(choice === 'changeTotalQuantity') {
        this.rate.rateItems[rateItemsIndex].quantity = parseFloat((
          this.rate.rateItems[rateItemsIndex].quantity *
          this.quantityIncrement).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
      }
      this.type = this.rate.rateItems[rateItemsIndex].type;
        switch (this.type) {
          case 'M' :
              this.rate.rateItems[rateItemsIndex].totalAmount = this.rate.rateItems[rateItemsIndex].quantity *
                this.rate.rateItems[rateItemsIndex].rate;

              this.totalAmountOfMaterial = this.totalAmountOfMaterial + this.rate.rateItems[rateItemsIndex].totalAmount;

               break;

          case 'L' :
              this.rate.rateItems[rateItemsIndex].totalAmount = this.rate.rateItems[rateItemsIndex].quantity *
                this.rate.rateItems[rateItemsIndex].rate;

              this.totalAmountOfLabour = this.totalAmountOfLabour + this.rate.rateItems[rateItemsIndex].totalAmount;

              break;

          case 'M + L' :
              this.rate.rateItems[rateItemsIndex].totalAmount = this.rate.rateItems[rateItemsIndex].quantity *
                this.rate.rateItems[rateItemsIndex].rate;

              this.totalAmountOfMaterialAndLabour = this.totalAmountOfMaterialAndLabour +
                 this.rate.rateItems[rateItemsIndex].totalAmount;

              break;
              }
      this.totalAmount = this.totalAmountOfMaterial + this.totalAmountOfLabour +this.totalAmountOfMaterialAndLabour;
    }
    this.ratePerUnitAmount = this.totalAmount / this.rate.quantity;
    this.rate.total = this.rateTotalByUnit();
    }
  validateMeasurementSheetItems(quantity:number,rate:number) {
    if(quantity===null || rate===null ) {
      return true;
    }
    if( quantity.toString().match(/^\d{1,7}(\.\d{1,4})?$/) &&
      rate.toString().match(/^\d{1,7}(\.\d{1,4})?$/) ) {
      return true;
    }
    var message = new Message();
    message.isError = true;
    message.error_msg = this.getMessages().AMOUNT_VALIDATION_MESSAGE;
    this.messageService.message(message);
    return false;
  }
  rateTotalByUnit() {
    if (this.workItemUnit === 'Sqm' && this.rate.unit !== 'Sqm') {
      this.totalByUnit = this.ratePerUnitAmount * 10.764;
      this.rate.total = this.totalByUnit;
    } else if (this.workItemUnit === 'Rm' && this.rate.unit !== 'Rm') {
      this.totalByUnit = this.ratePerUnitAmount * 3.28;
      this.rate.total = this.totalByUnit;
    } else if (this.workItemUnit === 'cum' && this.rate.unit !== 'cum') {
      this.totalByUnit = this.ratePerUnitAmount * 35.28;
      this.rate.total = this.totalByUnit;
    } else {
      this.rate.total = this.ratePerUnitAmount;
    }
    return this.rate.total;
  }

  updateRate(rateItemsArray: Rate) {
    if($('input').hasClass('validate-amount') ) {
      var message = new Message();
      message.isError = true;
      message.error_msg = this.getMessages().AMOUNT_VALIDATION_MESSAGE;
      this.messageService.message(message);
      return;
    }
    if (this.validateRateItem(rateItemsArray.rateItems)) {
      this.loaderService.start();
      let costHeadId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
      let workItemId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID));

      let rate = new Rate();
      rate.rateFromRateAnalysis = rateItemsArray.rateFromRateAnalysis;
      rate.total = this.commonService.decimalConversion(rateItemsArray.total);
      rate.quantity = rateItemsArray.quantity;
      rate.unit = rateItemsArray.unit;
      rate.rateItems = rateItemsArray.rateItems;
      rate.imageURL = rateItemsArray.imageURL;
      rate.notes = rateItemsArray.notes;

      this.costSummaryService.updateRate(this.baseUrl, costHeadId,
        this.categoryRateAnalysisId, workItemId, this.ccWorkItemId, rate).subscribe(
        success => this.onUpdateRateSuccess(success),
        error => this.onUpdateRateFailure(error)
      );
    } else {
      var message = new Message();
      message.isError = true;
      message.error_msg = Messages.MSG_ERROR_VALIDATION_QUANTITY_REQUIRED;
      this.messageService.message(message);
    }
  }

  validateRateItem(rateItems : Array<RateItem>) {
    for(let rateItemData of rateItems) {
      if((rateItemData.itemName === null || rateItemData.itemName === undefined || rateItemData.itemName.trim() === '') ||
        (rateItemData.rate === undefined || rateItemData.rate === null) ||
        (rateItemData.quantity === undefined || rateItemData.quantity === null)) {
        return false;
      }
    }
    return true;
  }

  onUpdateRateSuccess(success : string) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_RATE;
    this.messageService.message(message);

    for(let workItemData of this.workItemsList) {
      if(workItemData.rateAnalysisId === this.workItemRateAnalysisId) {
        workItemData.rate.total = this.totalByUnit;
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
    //this.showQuantityTab.emit('');
    this.loaderService.stop();
    this.closeRateTab();
  }

  onUpdateRateFailure(error: any) {
    if(error.err_code === 404 ||error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log(error);
    this.loaderService.stop();
  }

  onTotalQuantityChange(newTotalQuantity: number) {

    if (newTotalQuantity === 0 || newTotalQuantity === null) {

        newTotalQuantity=1;
        this.totalItemRateQuantity = newTotalQuantity;
        this.rate.quantity = newTotalQuantity;
        var message = new Message();
        message.isError = true;
        message.error_msg = Messages.MSG_QUANTITY_SHOULD_NOT_ZERO_OR_NULL;
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

  getItemName(event : any) {
    if (event.target.value !== '') {
      this.selectedItemName = event.target.value;
      event.target.value = '';
    }
  }

  setItemName(event : any, changeEvent? : string) {
    if (event.target.value === '' && !changeEvent) {
      event.target.value = this.selectedItemName;
    }

    if(this.arrayOfRateItems !== undefined) {
      this.setRate(this.arrayOfRateItems);
    }
  }

  getRateItemsByOriginalName(rateItem: any, index:number) {
      this.selectedRateItem = rateItem;
      this.selectedRateItemIndex = index;

      this.costSummaryService.getRateItemsByOriginalName(this.baseUrl, rateItem.originalItemName).subscribe(
        rateItemsData => this.onGetRateItemsByOriginalNameSuccess(rateItemsData.data),
        error => this.onGetRateItemsByOriginalNameFailure(error)
      );
  }

  onGetRateItemsByOriginalNameSuccess(rateItemsData: any) {
      this.arrayOfRateItems = rateItemsData;
  }

  setRate(rateItemsData : any) {

    let selectedItemName = this.selectedRateItem.itemName;
    let rateItemData : Array<RateItem> = rateItemsData.filter(
      function( rateItemData1: any){
        return rateItemData1.itemName === selectedItemName;
      });

    if(rateItemData.length !== 0) {
      let rateItems: Array<RateItem> = this.rate.rateItems.filter(
        function (rateItems: any) {
          return rateItems.itemName === selectedItemName;
        });

      rateItems[0].rate = rateItemData[0].rate;

      this.calculateTotal();

      let workItemRateAnalysisId = this.workItemRateAnalysisId;
      let workItemData: Array<WorkItem> = this.workItemsList.filter(
        function (workItemData: any) {
          return workItemData.rateAnalysisId === workItemRateAnalysisId;
        });

      workItemData[0].rate = this.rate;
    }
  }

  closeRateTab() {
    this.closeRateView.emit();
  }

  closeInnerViewTab() {
    this.closeInnerView.emit();
  }


  onGetRateItemsByOriginalNameFailure(error: any) {
    if(error.err_code === 404 ||error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
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

  getStandardNotes() {
    return StandardNotes;
  }

  getProjectElements() {
    return ProjectElements;
  }
  getMessages() {
    return Messages;
  }
}
