import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../../../../shared/index';
import { QuantityItem } from '../../../../model/quantity-item';
import { CostSummaryService } from '../../cost-summary.service';
import {
  ProjectElements, Button, TableHeadings, Label, Headings,
  ValueConstant
} from '../../../../../../shared/constants';
import { LoaderService } from '../../../../../../shared/loader/loaders.service';

@Component({
  moduleId: module.id,
  selector: 'bi-get-quantity',
  templateUrl: 'get-quantity.component.html',
  styleUrls: ['get-quantity.component.css'],
})

export class GetQuantityComponent implements OnInit {
  @Input() quantityItems :  Array<QuantityItem>;
  @Input() categoryRateAnalysisId : number;
  @Output() refreshCategoryList = new EventEmitter();

  projectId : string;
  buildingId: string;
  quantityItemName: string;
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
    this.updateQuantity('updateNos');
    this.updateQuantity('updateLength');
    this.updateQuantity('updateBreadth');
    this.updateQuantity('updateHeight');
    }

  updateQuantity(choice:string ) {
    switch(choice) {
      case 'updateNos': {
        this.quantityNumbersTotal =0;
        for(let quantityIndex=0; quantityIndex<this.quantityItems.length; quantityIndex++) {
          this.quantityNumbersTotal= parseFloat((this.quantityNumbersTotal +
            this.quantityItems[quantityIndex].nos).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        }
        this.getQuantityTotal(this.quantityItems);
      }
        break;
      case 'updateLength': {
        this.lengthTotal = 0;
        for (let quantityIndex = 0; quantityIndex < this.quantityItems.length; quantityIndex++) {
          this.lengthTotal = parseFloat((this.lengthTotal +
            this.quantityItems[quantityIndex].length).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        }
        this.getQuantityTotal(this.quantityItems);
      }
        break;
      case 'updateBreadth' : {
        this.breadthTotal= 0;
        for(let quantityIndex=0; quantityIndex<this.quantityItems.length; quantityIndex++) {
          this.breadthTotal = parseFloat((this.breadthTotal +
            this.quantityItems[quantityIndex].breadth).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        }
        this.getQuantityTotal(this.quantityItems);
      }
        break;
      case 'updateHeight' : {
        this.heightTotal=0;
        for(let quantityIndex=0; quantityIndex<this.quantityItems.length; quantityIndex++) {
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

    for(let quantityIndex=0; quantityIndex < this.quantityItems.length; quantityIndex++) {

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

  updateQuantityItem(quantityItems : QuantityItem) {
    this.loaderService.start();
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let costHeadId = parseFloat(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
    let workItemId = parseFloat(SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID));

    this.costSummaryService.updateQuantityItems( projectId, buildingId, costHeadId, this.categoryRateAnalysisId,
      workItemId, quantityItems).subscribe(
      costHeadItemSave => this.onUpdateQuantityItemsSuccess(costHeadItemSave),
      error => this.onUpdateQuantityItemsFailure(error)
    );
  }

  onUpdateQuantityItemsSuccess(costHeadItemSave: any) {
    this.quantityItems = costHeadItemSave.data.item;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM;
    this.messageService.message(message);
    this.refreshCategoryList.emit();
    this.loaderService.stop();
  }

  onUpdateQuantityItemsFailure(error: any) {
    var message = new Message();
    message.isError = true;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
    this.loaderService.stop();
  }

  setQuantityItemNameForDelete(quantityItemName: string) {
    this.quantityItemName = quantityItemName;
  }

  deleteQuantityItem() {
    this.loaderService.start();
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let costHeadId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
    let workItemId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID));

    this.costSummaryService.deleteQuantityItem( projectId, buildingId, costHeadId, this.categoryRateAnalysisId,
      workItemId, this.quantityItemName).subscribe(
      costHeadItemDelete => this.onDeleteQuantityItemSuccess(costHeadItemDelete),
      error => this.onDeleteQuantityItemFailure(error)
    );
  }

  onDeleteQuantityItemSuccess(costHeadItemDelete: any) {

    this.quantityItems = costHeadItemDelete.data.quantityItems;
    this.updateQuantity('updateNos');
    this.updateQuantity('updateLength');
    this.updateQuantity('updateBreadth');
    this.updateQuantity('updateHeight');
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_ITEM;
    this.messageService.message(message);
    this.loaderService.stop();
  }

  onDeleteQuantityItemFailure(error: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
    this.loaderService.stop();
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
