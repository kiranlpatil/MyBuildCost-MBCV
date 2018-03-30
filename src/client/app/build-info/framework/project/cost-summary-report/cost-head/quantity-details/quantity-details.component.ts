import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../../../model/category';
import { QuantityItem } from '../../../../model/quantity-item';
import { WorkItem } from '../../../../model/work-item';
import { Button, Label, Messages } from '../../../../../../shared/constants';
import * as lodsh from 'lodash';
import { QuantityDetails } from '../../../../model/quantity-details';
import { Message, MessageService, SessionStorage, SessionStorageService } from '../../../../../../shared/index';
import { CostSummaryService } from '../../cost-summary.service';

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

    quantityItemsArray:any = {};
    workItemData :Array<WorkItem>;
    keyQuantity:string;
    quantityName:string;
    quantityIndex:number;
    showWorkItemTabName: string=null;

      constructor(private costSummaryService : CostSummaryService, private messageService:MessageService) {
      }

   ngOnInit() {
    this.workItemData = this.workItem;

  }

  getQuantity(quantityDetail : QuantityDetails) {
    if(this.showWorkItemTabName !==  Label.WORKITEM_QUANTITY_TAB) {
      if(quantityDetail.quantityItems.length !== 0) {
        this.quantityItemsArray = quantityDetail.quantityItems;
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

  deleteQuantityByName(quantityName: string,quantityIndex:number) {

    this.quantityName = quantityName;
    this.quantityIndex = quantityIndex;
    let costHeadId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));

    this.costSummaryService.deleteQuantityByName(this.baseUrl, costHeadId, this.categoryRateAnalysisId,
      this.workItemRateAnalysisId, quantityName).subscribe(
      success => this.onDeleteQuantityByNameSuccess(success),
      error => this.onDeleteQuantityByNameFailure(error)
    );
  }

  onDeleteQuantityByNameSuccess(success: any) {
        for(let quantityData of this.quantityDetails) {
          if(quantityData.name === this.quantityName) {
            this.quantityDetails.splice(this.quantityIndex);
            break;
          }
          break;
        }
       var message = new Message();
       message.isError = false;
       message.custom_message = Messages.MSG_SUCCESS_DELETE_QUANTITY_ITEM;
       this.messageService.message(message);
       this.refreshWorkItemList.emit(this.categoryRateAnalysisId);
  }

  onDeleteQuantityByNameFailure(error: any) {
    console.log('Delete Quantity error');
    }


  onInputKeyQuantity(keyQuantity:string) {
    this.keyQuantity=keyQuantity;
  }

  getLabel() {
    return Label;
  }
  getButton() {
    return Button;
  }
  setShowWorkItemTab( tabName : string) {
    this.showWorkItemTabName = tabName;
  }
}
