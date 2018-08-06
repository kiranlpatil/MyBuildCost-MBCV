import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../../../model/category';
import { QuantityItem } from '../../../../model/quantity-item';
import { WorkItem } from '../../../../model/work-item';
import {
  Button, Label, Messages, ProjectElements, TableHeadings,
  ValueConstant
} from '../../../../../../shared/constants';
import * as lodsh from 'lodash';
import { QuantityDetails } from '../../../../model/quantity-details';
import {
  CommonService, Message, MessageService, SessionStorage,
  SessionStorageService
} from '../../../../../../shared/index';
import { CostSummaryService } from '../../cost-summary.service';
import { LoaderService } from '../../../../../../shared/loader/loaders.service';
import { Rate } from '../../../../model/rate';
import { SteelQuantityItems } from '../../../../model/SteelQuantityItems';
import { ErrorService } from '../../../../../../shared/services/error.service';
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'bi-quantity-details',
  templateUrl: 'quantity-details.component.html',
  styleUrls: ['quantity-details.component.css'],
})

export class QuantityDetailsComponent implements OnInit {

  @Input() quantityDetails : Array<QuantityDetails>;
  @Input() workItem : WorkItem;
  @Input() workItemsList : Array<WorkItem>;
  @Input() categoryDetails :  Array<Category>;
  @Input() categoryRateAnalysisId : number;
  @Input() workItemRateAnalysisId : number;
  @Input() ccWorkItemId : number;
  @Input() baseUrl : string;

  @Output() categoriesTotalAmount = new EventEmitter<number>();
  @Output() categoriesTotalAmountOfQty = new EventEmitter<number>();
  @Output() refreshWorkItemList = new EventEmitter();
  @Output() quantityName = new EventEmitter<String>();
  @Output() workItemRateId = new EventEmitter<number>();
  @Output() ccWorkItemRateId = new EventEmitter<number>();

  workItemId : number;
  quantityId : number;
  currentId : number;
  currentQtyName : string;
  currentQuantityType : string;
  existingQuantityType : string;
  rateItemsArray : Rate;
  unit:string='';
  previousRateQuantity : number = 0;
  quantityIncrement : number = 1;
  total : number;
  steelquantityItem:any;
  currentFloorIndex : number;
  showInnerView : string;
  quantity : QuantityDetails;
  quantityItemsArray: any = {};
  workItemData: WorkItem;
  keyQuantity: string;
  currentQuantityName: string;
  showQuantityTab : string = null;
  flagForFloorwiseQuantity : string = null;

  constructor(private costSummaryService: CostSummaryService, private messageService: MessageService,
              private loaderService: LoaderService,private errorService:ErrorService) {
  }

   ngOnInit() {
    this.workItemData = this.workItem;
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

  getTableHeadings() {
    return TableHeadings;
  }

  setCategoriesTotal( categoriesTotal : number) {
    this.categoriesTotalAmount.emit(categoriesTotal);
  }

  getQuantity(quantityDetail : QuantityDetails, floorIndex : number, showInnerView : string) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemRateAnalysisId);
    if(quantityDetail.name !== undefined) {
      if (floorIndex !== this.currentFloorIndex || this.showInnerView !== showInnerView) {
        this.setFloorIndex(floorIndex);
        if (showInnerView !== this.getLabel().WORKITEM_STEEL_QUANTITY_TAB && quantityDetail.quantityItems && quantityDetail.quantityItems.length !== 0 ) {
          this.quantityItemsArray = lodsh.cloneDeep(quantityDetail.quantityItems);
          this.keyQuantity = quantityDetail.name;
          this.quantityId = quantityDetail.id;
        }else if(showInnerView == this.getLabel().WORKITEM_STEEL_QUANTITY_TAB) {
          if( quantityDetail.steelQuantityItems ) {
            this.steelquantityItem=lodsh.cloneDeep(quantityDetail.steelQuantityItems);
          }else {
            this.steelquantityItem=new SteelQuantityItems();
          }
          this.keyQuantity = quantityDetail.name;
          this.quantityId = quantityDetail.id;
        } else {
          if (!quantityDetail.isDirectQuantity) {
            this.quantityItemsArray = lodsh.cloneDeep(quantityDetail.quantityItems);
            this.keyQuantity = quantityDetail.name;
            if(quantityDetail.id === undefined && this.currentQtyName === quantityDetail.name) {
              this.quantityId = this.currentId ;
            }else {
              this.quantityId = quantityDetail.id;
            }
          } else {
            this.quantityItemsArray = [];
            this.keyQuantity = quantityDetail.name;
            this.quantityId = quantityDetail.id;
          }
        }
        this.showInnerView = showInnerView;
      } else {
        this.showInnerView = null;
      }
    } else {
      var message = new Message();
      message.isError = true;
      message.error_msg = Messages.MSG_ERROR_VALIDATION_QUANTITY_NAME_REQUIRED;
      this.messageService.message(message);
    }
  }

  updateFloorwiseQunatityConfirmation(quantity :any, flag : string, quantityIndex ?: number) {
    this.flagForFloorwiseQuantity = flag;
    if(flag === Label.DIRECT_QUANTITY) {
      quantity.isDirectQuantity = true;
    }
    if(quantity.quantityItems===undefined) {
      quantity.quantityItems=[];
    }
    if((flag === Label.DIRECT_QUANTITY && quantity.quantityItems &&  quantity.quantityItems.length !== 0 && quantity.total !== 0) ||
      (flag === Label.WORKITEM_QUANTITY_TAB && quantity.quantityItems && quantity.quantityItems.length === 0 && quantity.total !== 0)) {
      if(flag === Label.DIRECT_QUANTITY) {
        this.existingQuantityType = ProjectElements.DIRECT_QUANTITY;
        this.currentQuantityType = ProjectElements.MEASUREMENT_SHEET;
      } else {
        this.existingQuantityType = ProjectElements.MEASUREMENT_SHEET;
        this.currentQuantityType = ProjectElements.DIRECT_QUANTITY;
      }
      $('#updateFloorwiseQuantityModal'+quantityIndex).modal();
    } else if((flag === Label.DIRECT_QUANTITY && quantity.steelQuantityItems && quantity.steelQuantityItems.steelQuantityItem.length !==0 && quantity.total !== 0) ||
      (flag === Label.WORKITEM_STEEL_QUANTITY_TAB && quantity.steelQuantityItems && quantity.steelQuantityItems.steelQuantityItem.length ===0 && quantity.total !== 0)) {
      $('#updateFloorwiseQuantityModal'+quantityIndex).modal();
    } else {
      if(flag === Label.DIRECT_QUANTITY) {
        this.updateQuantityDetails(quantity, flag, quantityIndex);
      } else if(flag === Label.WORKITEM_QUANTITY_TAB || flag === Label.WORKITEM_STEEL_QUANTITY_TAB ) {
        this.getQuantity(quantity, quantityIndex, flag);
      }
    }
  }

  updateDetailedQuanityAfterConfirmation(quantityData : any) {
    if(quantityData.detailedQuantityFlag === Label.DIRECT_QUANTITY) {
      this.updateQuantityDetails(quantityData.quantity, quantityData.detailedQuantityFlag, quantityData.quantityIndex);
    } else if(quantityData.detailedQuantityFlag === Label.WORKITEM_QUANTITY_TAB ||quantityData.detailedQuantityFlag === Label.WORKITEM_STEEL_QUANTITY_TAB  ) {
      this.getQuantity(quantityData.quantity, quantityData.quantityIndex, quantityData.detailedQuantityFlag);
    }
  }

  setQuantityTotal(quantity : QuantityDetails, total: number) {
    this.quantity = quantity;
    this.total = total;
  }

  updateTotal(obj : any) {
    this.quantity.total = obj.total;
  }

  updateQuantityDetails(quantity :any, flag : string, quantityIndex ?: number) {
    this.quantity = quantity;
    let costHeadId = parseFloat(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
    if(this.validateQuantityName(quantity.name)) {
      let quantityDetailsObj : QuantityDetails = new QuantityDetails();
      quantityDetailsObj.id =  quantity.id;
      quantityDetailsObj.name = quantity.name;
      quantityDetailsObj.total = quantity.total;
      if(flag === Label.NAME) {
        if(quantity.quantityItems || quantity.steelQuantityItems) {
          quantityDetailsObj.quantityItems = quantity.quantityItems;
          quantityDetailsObj.steelQuantityItems = quantity.steelQuantityItems;
        }else {
          quantityDetailsObj.quantityItems = [];
          quantityDetailsObj.steelQuantityItems = new SteelQuantityItems();
        }
      } else if(flag === Label.DIRECT_QUANTITY) {
        quantityDetailsObj.quantityItems = [];
        quantityDetailsObj.steelQuantityItems = new SteelQuantityItems();
        this.quantityDetails[quantityIndex].quantityItems = [];
        this.quantityDetails[quantityIndex].steelQuantityItems =  new SteelQuantityItems();
        this.showInnerView = null;
      } else {
        console.log('error');
      }
  /*    if(quantity.quantityItems) {
        quantityDetailsObj.quantityItems = [];
        this.quantityDetails[quantityIndex].quantityItems = [];
      } else if(quantity.steelQuantityItems) {
        quantityDetailsObj.steelQuantityItems = new SteelQuantityItems();
        this.quantityDetails[quantityIndex].steelQuantityItems = new SteelQuantityItems();
      }*/
      this.loaderService.start();

      this.costSummaryService.updateQuantityDetails(this.baseUrl, costHeadId, this.categoryRateAnalysisId,
        this.workItemRateAnalysisId, this.ccWorkItemId, quantityDetailsObj).subscribe(
        success => this.onUpdateQuantityDetailSuccess(success, flag),
        error => this.onUpdateQuantityDetailFailure(error)
      );
    } else {
      var message = new Message();
      message.isError = true;
      message.error_msg = Messages.MSG_ERROR_VALIDATION_QUANTITY_NAME_REQUIRED;
      this.messageService.message(message);
    }
  }

  onUpdateQuantityDetailSuccess(success :any, flag : string) {
    var message = new Message();
    message.isError = false;

    if(success.data.id) {
      this.currentQtyName = success.data.name;
      this.currentId = success.data.id;
      this.quantity.id = success.data.id;
    }

    if(flag ===  Label.NAME) {
      this.loaderService.stop();
      let categoryDetailsTotalAmount = this.calculate();
      this.categoriesTotalAmountOfQty.emit(categoryDetailsTotalAmount);
      message.custom_message = Messages.MSG_SUCCESS_UPDATE_QUANTITY_NAME_WORKITEM;
      this.messageService.message(message);
    } else {
      this.loaderService.stop();
      let categoryDetailsTotalAmount = this.calculate();
      this.categoriesTotalAmountOfQty.emit(categoryDetailsTotalAmount);
      message.custom_message = Messages.MSG_SUCCESS_UPDATE_DIRECT_QUANTITY_OF_WORKITEM;
      this.messageService.message(message);
     // this.refreshWorkItemList.emit();
    }
  }

  calculate() {
    let quantityItemDetailsTotal = 0;
    for(let quantityItemDetail of this.workItemData.quantity.quantityItemDetails) {
      quantityItemDetailsTotal = quantityItemDetailsTotal + quantityItemDetail.total;
    }
    this.workItemData.quantity.total = quantityItemDetailsTotal;
    this.workItemData.amount = quantityItemDetailsTotal * this.workItemData.rate.total;
    let categoryDetailsTotalAmount = 0;
    for(let categoryData of this.categoryDetails) {
      if(categoryData.rateAnalysisId === this.categoryRateAnalysisId) {
        let categoryTotalAmount = 0;
        for(let workItemData of this.workItemsList) {
          if(this.workItem.rateAnalysisId === workItemData.rateAnalysisId) {
            workItemData.isDetailedQuantity = true;
          }
          categoryTotalAmount =categoryTotalAmount + workItemData.amount;
        }
        categoryData.amount = categoryTotalAmount;
      }
      categoryDetailsTotalAmount = categoryDetailsTotalAmount + categoryData.amount;
    }
    return categoryDetailsTotalAmount;
  }

  onUpdateQuantityDetailFailure(error: any) {
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('success : '+JSON.stringify(error));
    this.loaderService.stop();
  }

  validateQuantityName(quantityName: string) {
    if(quantityName === '' || quantityName === undefined || quantityName.trim()=== '') {
      return false;
    } else {
      return true;
    }
  }
  setFloorIndex(floorIndex : number) {
    this.currentFloorIndex = floorIndex;
  }

  getRateByQuantity(cost : number,floorIndex : number, costQuantity : number, showInnerView : string) {
    if (cost !== 0) {
      if (floorIndex !== this.currentFloorIndex || this.showInnerView !== showInnerView) {
        this.setFloorIndex(floorIndex);
        this.setWorkItemDataForRateView(this.workItemRateAnalysisId, this.workItem.rate);
        this.calculateQuantity(this.workItem, costQuantity);
        this.showInnerView = this.getLabel().GET_RATE_BY_QUANTITY;
      } else {
        this.closeInnerView();
      }
    }
  }

  closeInnerView() {
    this.showInnerView = null;
    this.setFloorIndex(-1);
  }

  setWorkItemDataForRateView(workItemId : number, rate : Rate) {
    this.workItemId = workItemId;
    this.rateItemsArray = lodsh.cloneDeep(rate);
    this.unit = lodsh.cloneDeep(rate.unit);
  }

  calculateQuantity(workItem : WorkItem, costQuantity : number) {
    this.previousRateQuantity = lodsh.cloneDeep(workItem.rate.quantity);
    this.rateItemsArray.quantity = costQuantity;
    this.quantityIncrement = this.rateItemsArray.quantity / this.previousRateQuantity;
    for (let rateItemsIndex = 0; rateItemsIndex < this.rateItemsArray.rateItems.length; rateItemsIndex++) {
      this.rateItemsArray.rateItems[rateItemsIndex].quantity = parseFloat((
        this.rateItemsArray.rateItems[rateItemsIndex].quantity *
        this.quantityIncrement).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
    }
  }

  setQuantityNameForDelete(quantityName: string) {
    this.quantityName.emit(quantityName);
    this.ccWorkItemRateId.emit(this.ccWorkItemId);
    this.workItemRateId.emit(this.workItemRateAnalysisId);
  }

  deleteQuantityDetailsByName(quantityName: string, workItemRateID:number, ccWorkItemID:number) {
    if(quantityName !== null && quantityName !== undefined && quantityName !== '') {
      this.currentQuantityName = quantityName;
      this.loaderService.start();
      let costHeadId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
      this.costSummaryService.deleteQuantityDetailsByName(this.baseUrl, costHeadId, this.categoryRateAnalysisId,
        workItemRateID, ccWorkItemID, quantityName).subscribe(
        success => this.onDeleteQuantityDetailsByNameSuccess(success),
        error => this.onDeleteQuantityDetailsByNameFailure(error)
      );
    } else {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_QUANTITY_DETAILS;
      this.messageService.message(message);
      this.refreshWorkItemList.emit();
    }
  }

  onDeleteQuantityDetailsByNameSuccess(success: any) {
    for (let quantityIndex in this.quantityDetails) {
      if (this.quantityDetails[quantityIndex].name ===  this.currentQuantityName) {
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
    this.loaderService.stop();
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('Delete Quantity error');
  }
}
