import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../../../model/category';
import { QuantityItem } from '../../../../model/quantity-item';
import { WorkItem } from '../../../../model/work-item';
import { Button, Label } from '../../../../../../shared/constants';
import * as lodsh from 'lodash';
import { QuantityDetails } from '../../../../model/quantity-details';

@Component({
  moduleId: module.id,
  selector: 'bi-quantity-details',
  templateUrl: 'quantity-details.component.html',
  styleUrls: ['quantity-details.component.css'],
})

export class QuantityDetailsComponent implements OnInit {

  @Input() quantityItems : Array<QuantityDetails>;
  @Input() workItem : Array<WorkItem>;
  @Input() workItemsList : Array<WorkItem>;
  @Input() categoryDetails :  Array<Category>;
  @Input() categoryRateAnalysisId : number;
  @Input() baseUrl : string;

  @Output() categoriesTotalAmount = new EventEmitter<number>();
    quantityItemsArray:any = {};
    workItemData :Array<WorkItem>;
    quantityDetails : Array<QuantityDetails>;
    keyQuantity:string;
    showWorkItemTabName: string=null;
    amount:number;

  ngOnInit() {
    this.workItemData = this.workItem;
    this.quantityDetails = this.quantityItems;
    console.log(this.quantityDetails);
  }

  getQuantity(quantityItems:Array<QuantityItem>) {
    if(this.showWorkItemTabName !==  Label.WORKITEM_QUANTITY_TAB) {
      if(quantityItems !== undefined) {
        this.quantityItemsArray = quantityItems;
      } else {
        this.quantityItemsArray = [];

      }
      this.showWorkItemTabName = Label.WORKITEM_QUANTITY_TAB;
    }else {
      this.showWorkItemTabName=null;
    }
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
}
