import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../../../../shared/index';
import { QuantityItem } from '../../../../model/quantity-item';
import { CostSummaryService } from '../../cost-summary.service';
import { ProjectElements } from '../../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-get-quantity',
  templateUrl: 'get-quantity.component.html',
  styleUrls: ['get-quantity.component.css'],
})

export class GetQuantityComponent implements OnInit {
  @Input() quantityItems :  Array<QuantityItem>;
  @Input() subCategoryRateAnalysisId : number;
  @Output() refreshSubCategoryList = new EventEmitter();

  projectId : string;
  buildingId: string;
  itemName: string;
  quantityTotal: number = 0;
  quanitytNumbersTotal: number = 0;
  lengthTotal: number = 0;
  breadthTotal: number = 0;
  heightTotal: number = 0;
  deleteConfirmationQuantityItem = ProjectElements.QUANTITY_ITEM;

  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.updateQuantity(this.quantityItems, 'updateNos');
    this.updateQuantity(this.quantityItems, 'updateLength');
    this.updateQuantity(this.quantityItems, 'updateBreadth');
    this.updateQuantity(this.quantityItems, 'updateHeight');
    }

  updateQuantity(quantityItems : any, choice:string ) {
    switch(choice) {
       case 'updateNos': {
                          this.quanitytNumbersTotal =0;
                          for(let i=0;i<this.quantityItems.length;i++) {
                              this.quanitytNumbersTotal= parseFloat((this.quanitytNumbersTotal +this.quantityItems[i].nos).toFixed(2));
                              }
                              this.getQuantityTotal(this.quantityItems);
       }
                          break;
       case 'updateLength': {
                          this.lengthTotal = 0;
                           for (let i = 0; i < this.quantityItems.length; i++) {
                                this.lengthTotal = parseFloat((this.lengthTotal + this.quantityItems[i].length).toFixed(2));
                                }
                                this.getQuantityTotal(this.quantityItems);
                            }
                            break;
       case 'updateBreadth' : {
                          this.breadthTotal= 0;
                          for(let i=0;i<this.quantityItems.length;i++) {
                                  this.breadthTotal = parseFloat((this.breadthTotal +this.quantityItems[i].breadth).toFixed(2));
                                 }
                                   this.getQuantityTotal(this.quantityItems);
                            }
                            break;
       case 'updateHeight' : {
                            this.heightTotal=0;
                           for(let i=0;i<this.quantityItems.length;i++) {
                                  this.heightTotal =parseFloat((this.heightTotal +this.quantityItems[i].height).toFixed(2));
                                  }
                      this.getQuantityTotal(this.quantityItems);
                            }
                            break;
       }
       }

  getQuantityTotal(quantityItems : any) {
    this.quantityTotal = 0;
    this.quantityItems = quantityItems;
    for(let i=0;i<this.quantityItems.length;i++) {
      if (this.quantityItems[i].length === undefined || this.quantityItems[i].length === 0 ||
        this.quantityItems[i].length === null) {
        var q1 = this.quantityItems[i].height;
        var q2 = this.quantityItems[i].breadth;
      } else if (this.quantityItems[i].height === undefined || this.quantityItems[i].height === 0 ||
        this.quantityItems[i].height === null) {
        q1 = this.quantityItems[i].length;
        q2 = this.quantityItems[i].breadth;
      } else if (this.quantityItems[i].breadth === undefined || this.quantityItems[i].breadth === 0 ||
        this.quantityItems[i].breadth === null) {
        q1 = this.quantityItems[i].length;
        q2 = this.quantityItems[i].height;
      } else {
        q1 = this.quantityItems[i].length;
        q2 = this.quantityItems[i].breadth;
      }
      this.quantityItems[i].quantity = parseFloat((q1 * q2).toFixed(2));
      this.quantityTotal = parseFloat((this.quantityTotal + this.quantityItems[i].quantity).toFixed(2));
      }
  }

  addItem() {
    let quantity = {
      item : '',
      remarks : '',
      nos : 0,
      length : 0,
      breadth : 0,
      height : 0,
      quantity : 0,
      unit : 'sqft'
    };
    this.quantityItems.push(quantity);
  }

  updateQuantityItem(quantityItems : any) {

    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let costHeadId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID);
    let workItemId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID);

    this.costSummaryService.updateQuantityItems(projectId,buildingId,parseInt(costHeadId), this.subCategoryRateAnalysisId,
      parseInt(workItemId), quantityItems).subscribe(
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
    this.refreshSubCategoryList.emit();
  }

  onUpdateQuantityItemsFailure(error: any) {
    var message = new Message();
    message.isError = true;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
  }

  setQuantityItemNameForDelete(itemName: string) {
    this.itemName = itemName;
  }

  deleteQuantityItem() {

    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let costHeadId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID);
    let workItemId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID);

    this.costSummaryService.deleteQuantityItem(projectId,buildingId,parseInt(costHeadId), this.subCategoryRateAnalysisId,
      parseInt(workItemId), this.itemName).subscribe(
      costHeadItemDelete => this.onDeleteQuantityItemSuccess(costHeadItemDelete),
      error => this.onDeleteQuantityItemFailure(error)
    );
  }

  onDeleteQuantityItemSuccess(costHeadItemDelete: any) {
    this.quantityItems = costHeadItemDelete.data.quantityItems;
    this.updateQuantity(this.quantityItems,'updateNos');
    this.updateQuantity(this.quantityItems,'updateLength');
    this.updateQuantity(this.quantityItems,'updateBreadth');
    this.updateQuantity(this.quantityItems,'updateHeight');
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_ITEM;
    this.messageService.message(message);
  }

  onDeleteQuantityItemFailure(error: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
  }

  deleteElement(elementType : string) {
    if(elementType === ProjectElements.QUANTITY_ITEM) {
      this.deleteQuantityItem();
    }
  }

}
