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

@Component({
  moduleId: module.id,
  selector: 'bi-get-quantity',
  templateUrl: 'get-quantity.component.html',
  styleUrls: ['get-quantity.component.css'],
})

export class GetQuantityComponent implements OnInit {
  @Input() quantityItems :  Array<QuantityItem>;
  @Input() categoryDetails :  Array<Category>;
  @Input() categoryRateAnalysisId : number;
  @Input() baseUrl : string;
  @Output() refreshCategoryList = new EventEmitter();

  projectId : string;
  buildingId: string;
  workItemId: number;
  quantityIndex: number;
  quantityTotal: number = 0;
  quantityNumbersTotal: number = 0;
  lengthTotal: number = 0;
  breadthTotal: number = 0;
  heightTotal: number = 0;
  deleteConfirmationQuantityItem = ProjectElements.QUANTITY_ITEM;

  constructor(private costSummaryService : CostSummaryService,  private loaderService: LoaderService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.updateAllQuantity();
   this.workItemId = parseFloat(SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID));
    }

    updateQuantity(choice:string ) {
    switch(choice) {
      case 'updateNos': {
        this.quantityNumbersTotal =0;
        for(let quantityIndex in this.quantityItems) {
          this.quantityNumbersTotal= parseFloat((this.quantityNumbersTotal +
            this.quantityItems[quantityIndex].nos).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        }
        this.getQuantityTotal(this.quantityItems);
      }
        break;
      case 'updateLength': {
        this.lengthTotal = 0;
        for(let quantityIndex in this.quantityItems)  {
          this.lengthTotal = parseFloat((this.lengthTotal +
            this.quantityItems[quantityIndex].length).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        }
        this.getQuantityTotal(this.quantityItems);
      }
        break;
      case 'updateBreadth' : {
        this.breadthTotal= 0;
        for(let quantityIndex in this.quantityItems)  {
          this.breadthTotal = parseFloat((this.breadthTotal +
            this.quantityItems[quantityIndex].breadth).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        }
        this.getQuantityTotal(this.quantityItems);
      }
        break;
      case 'updateHeight' : {
        this.heightTotal=0;
        for(let quantityIndex in this.quantityItems)  {
          this.heightTotal =parseFloat((this.heightTotal +
            this.quantityItems[quantityIndex].height).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
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

      if (this.quantityItems[quantityIndex].length === undefined || this.quantityItems[quantityIndex].length === 0 ||
        this.quantityItems[quantityIndex].length === null) {

        var multiplier = this.quantityItems[quantityIndex].height;
        var multiplicand = this.quantityItems[quantityIndex].breadth;

      } else if (this.quantityItems[quantityIndex].height === undefined || this.quantityItems[quantityIndex].height === 0 ||
        this.quantityItems[quantityIndex].height === null) {

        multiplier = this.quantityItems[quantityIndex].length;
        multiplicand = this.quantityItems[quantityIndex].breadth;

      } else if (this.quantityItems[quantityIndex].breadth === undefined || this.quantityItems[quantityIndex].breadth === 0 ||
        this.quantityItems[quantityIndex].breadth === null) {

        multiplier = this.quantityItems[quantityIndex].length;
        multiplicand = this.quantityItems[quantityIndex].height;

      } else {

        multiplier = this.quantityItems[quantityIndex].length;
        multiplicand = this.quantityItems[quantityIndex].breadth;

      }

      this.quantityItems[quantityIndex].quantity = parseFloat((multiplier * multiplicand).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
      this.quantityTotal = parseFloat((this.quantityTotal +
        this.quantityItems[quantityIndex].quantity).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
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
    if(this.validateQuantityIteamName(quantityItems)) {
      this.loaderService.start();
      let costHeadId = parseFloat(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
      this.costSummaryService.updateQuantityItems(this.baseUrl, costHeadId, this.categoryRateAnalysisId,
        this.workItemId, quantityItems).subscribe(
        success => this.onUpdateQuantityItemsSuccess(success),
        error => this.onUpdateQuantityItemsFailure(error)
      );
    } else {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_ERROR_VALIDATION_QUANTITY_REQUIRED;
      this.messageService.message(message);
    }
  }

  validateQuantityIteamName(quantityItems : Array<QuantityItem>) {
    for(let quantityItemData of quantityItems) {
      if(quantityItemData.item === '' || quantityItemData.item === undefined) {
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

    for(let categoryData of this.categoryDetails) {
      if(categoryData.rateAnalysisId === this.categoryRateAnalysisId) {
        for(let workItemData of categoryData.workItems) {
          if(workItemData.rateAnalysisId ===   this.workItemId) {
            workItemData.quantity.total =  this.quantityTotal;
          }
          break;
        }
      }
      break;
    }
      this.loaderService.stop();
    this.refreshCategoryList.emit();
  }

  onUpdateQuantityItemsFailure(error: any) {
    var message = new Message();
    message.isError = true;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
    this.loaderService.stop();
  }

  setQuantityItemNameForDelete(quantityIndex: number) {
     this.quantityIndex= quantityIndex;
  }

  deleteQuantityItem() {
        this.quantityItems.splice(this.quantityIndex,1);
      this.updateAllQuantity();
      }

  deleteElement(elementType : string) {
    if(elementType === ProjectElements.QUANTITY_ITEM) {
      this.deleteQuantityItem();
    }
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
