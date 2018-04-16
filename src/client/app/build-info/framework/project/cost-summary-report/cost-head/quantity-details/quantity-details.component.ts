import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../../../model/category';
import { QuantityItem } from '../../../../model/quantity-item';
import { WorkItem } from '../../../../model/work-item';
import { Button, Label, Messages } from '../../../../../../shared/constants';
import * as lodsh from 'lodash';
import { QuantityDetails } from '../../../../model/quantity-details';
import { Message, MessageService, SessionStorage, SessionStorageService } from '../../../../../../shared/index';
import { CostSummaryService } from '../../cost-summary.service';
import { LoaderService } from '../../../../../../shared/loader/loaders.service';

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

  quantityItemsArray: any = {};
  workItemData: Array<WorkItem>;
  keyQuantity: string;
  quantityName: string;
  showQuantityTab : string = null;
  showWorkItemTabName: string = null;

  constructor(private costSummaryService: CostSummaryService, private messageService: MessageService,
              private loaderService: LoaderService) {
  }

   ngOnInit() {
    this.workItemData = this.workItem;

  }

  getQuantity(quantityDetail : QuantityDetails) {
    if(this.showWorkItemTabName !==  Label.WORKITEM_QUANTITY_TAB) {
      if(quantityDetail.quantityItems.length !== 0) {
        this.quantityItemsArray = lodsh.cloneDeep(quantityDetail.quantityItems);
        this.keyQuantity = quantityDetail.name;
      } else {
        this.quantityItemsArray = [];
        quantityDetail.name = this.keyQuantity;
      }
      this.showWorkItemTabName = Label.WORKITEM_QUANTITY_TAB;
    }else {
      this.showWorkItemTabName=null;
    }
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

  setShowWorkItemTab( tabName : string) {
    this.showWorkItemTabName = tabName;
    this.refreshWorkItemList.emit();
  }
  closeQuantityView() {
    this.showQuantityTab = null;
    this.showWorkItemTabName = null;
  }
}
