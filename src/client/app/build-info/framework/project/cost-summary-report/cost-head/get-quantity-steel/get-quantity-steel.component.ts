import {Component, EventEmitter, OnInit, Input, Output, ChangeDetectorRef} from '@angular/core';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../../../../shared/index';
import { QuantityItem } from '../../../../model/quantity-item';
import { CostSummaryService } from '../../cost-summary.service';
import {
  ProjectElements, Button, TableHeadings, Label, Headings,
  ValueConstant
} from '../../../../../../shared/constants';
import { LoaderService } from '../../../../../../shared/loader/loaders.service';
import { Category } from '../../../../model/category';
import { WorkItem } from '../../../../model/work-item';
import { Router } from '@angular/router';
import { CommonService } from '../../../../../../../app/shared/services/common.service';
import { QuantityDetails } from '../../../../model/quantity-details';
import { SteelQuantityItem } from '../../../../model/steelQuantityItem';
import { SteelQuantityItems } from '../../../../model/SteelQuantityItems';


@Component({
  moduleId: module.id,
  selector: 'bi-get-quantity-steel',
  templateUrl: 'get-quantity-steel.component.html',
  styleUrls: ['get-quantity-steel.component.css'],
})

export class GetSteelQuantityComponent implements OnInit {
  @Input() steelQuantityItems: Array<SteelQuantityItem>;
  @Input() totalDiamterQuantity: SteelQuantityItems;
  @Input() quantityDetails :  Array<QuantityDetails>;
  @Input() categoryDetails :  Array<Category>;
  @Input() categoryRateAnalysisId : number;
  @Input() workItemRateAnalysisId : number;
  @Input() ccWorkItemId : number;
  @Input() workItemsList : Array<WorkItem>;
  @Input() baseUrl : string;
  @Input() workItemUnit : string;
  @Input() keyQuantity : string;
  @Input() quantityId : number;
  @Input() innerView: string;
  @Input() workItem ?: WorkItem;


  @Output() closeQuantityView = new EventEmitter();
  @Output() closeInnerView = new EventEmitter();
  @Output() categoriesTotalAmount = new EventEmitter<number>();

  diameterValuesArray:any[] =ValueConstant.STEEL_DIAMETER_VALUES.slice();
  workItemId:any;
  quantityItemSteel: Array<SteelQuantityItem>;

  total:number;
  constructor(private costSummaryService : CostSummaryService,  private loaderService: LoaderService,
              private messageService: MessageService, private _router : Router, private commonService: CommonService){

  }
  ngOnInit() {
    if(this.steelQuantityItems.length === 0) {
      for(let i=0; i<5; i++) {
        this.addQuantityItem();
      }
    }
    this.workItemId = parseFloat(SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID));
  }

    getDiameterQuantityFun(steelQuantityItemIndex:number,diameter:any,value:string,totalString:string) {
    let steelQuantityItem: any = this.steelQuantityItems[steelQuantityItemIndex];
    if (diameter === parseInt(this.steelQuantityItems[steelQuantityItemIndex].diameter)) {
      steelQuantityItem.weight =
        (0.000628 * diameter * diameter * this.steelQuantityItems[steelQuantityItemIndex].length *
          this.steelQuantityItems[steelQuantityItemIndex].nos) * 10;
      return steelQuantityItem.weight;
  }
    return 0;
  }

  getTotalDiameterQuantity(diameter :number,index:number) {
    let tempArray:any;
   for(let steelQuantityItemIndex in this.steelQuantityItems) {
    let steelQuantityItem: any =  this.steelQuantityItems[steelQuantityItemIndex];
    if (diameter == parseInt(this.steelQuantityItems[steelQuantityItemIndex].diameter) && this.steelQuantityItems[steelQuantityItemIndex].weight !== 0) {
      if(tempArray == undefined) {
        tempArray= {};
      }
      if(tempArray[diameter]==undefined) {
        tempArray[diameter]=[];
      }
      tempArray[diameter].push(steelQuantityItem.weight);
    }
  }
  if(tempArray && tempArray[diameter] ) {
     if((<any>this.totalDiamterQuantity.totalWeightOfDiameter===undefined)) {
       (<any>this.totalDiamterQuantity.totalWeightOfDiameter) = {};
     }
    (<any>this.totalDiamterQuantity.totalWeightOfDiameter)
      [this.getValueConstant().STEEL_DIAMETER_STRING_VALUES[index]]=
      tempArray[diameter].reduce((acc:any, val:any) => { return acc + val; });
    return tempArray[diameter].reduce((acc:any, val:any) => { return acc + val; });
  }
    return 0;
  }
  getQuantityTotal():number {
    let diameters=new Array(0);
    let diametersKeys:any={};
    for(let steelQuantityItemIndex in this.steelQuantityItems) {
      let steelQuantityItem: any =  this.steelQuantityItems[steelQuantityItemIndex];
       diametersKeys[
         this.getValueConstant().STEEL_DIAMETER_STRING_VALUES[
           this.getValueConstant().STEEL_DIAMETER_VALUES.indexOf(parseInt(steelQuantityItem.diameter))
           ]]=0;
    }
    diameters=Object.keys(diametersKeys)
    let total:number=0;

    for(let diameter in this.totalDiamterQuantity.totalWeightOfDiameter) {
      if(diameter !== 'undefined') {
        if (diameters.indexOf(diameter) !== -1) {
          total += parseFloat((<any>this.totalDiamterQuantity.totalWeightOfDiameter)[diameter]);
        } else {
          delete (<any>this.totalDiamterQuantity.totalWeightOfDiameter)[diameter];
        }
      }
    }
    this.total=total;
    return total;
  }
  addQuantityItem() {
    this.steelQuantityItems.push(new SteelQuantityItem('',0,0,0,0));
  }
  deleteQuantityItem(index:number) {
    this.totalDiamterQuantity.totalWeightOfDiameter
      [this.getValueConstant().STEEL_DIAMETER_STRING_VALUES[this.getValueConstant().STEEL_DIAMETER_VALUES.indexOf(parseInt(this.steelQuantityItems[index].diameter))]] = this.totalDiamterQuantity.totalWeightOfDiameter[this.getValueConstant().STEEL_DIAMETER_STRING_VALUES[this.getValueConstant().STEEL_DIAMETER_VALUES.indexOf(parseInt(this.steelQuantityItems[index].diameter))]]- this.steelQuantityItems[index].weight;
    this.steelQuantityItems.splice(index,1);
    }
  updateQuantityItem(totalDiameterQuantity : SteelQuantityItems) {
    totalDiameterQuantity.steelQuantityItem=this.steelQuantityItems;
    totalDiameterQuantity.unit=this.workItem.unit;
    let quantityObj : QuantityDetails = new QuantityDetails();
      quantityObj.id = this.quantityId;
      quantityObj.name = this.keyQuantity;
      quantityObj.steelQuantityItems = totalDiameterQuantity;
      quantityObj.total= parseFloat(this.total.toFixed(2));
      this.loaderService.start();
      let costHeadId = parseFloat(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
      this.costSummaryService.updateQuantityItems(this.baseUrl, costHeadId, this.categoryRateAnalysisId,
        this.workItemId, this.ccWorkItemId, quantityObj).subscribe(
        success => this.onUpdateQuantityItemsSuccess(success),
        error => this.onUpdateQuantityItemsFailure(error)
      );
      }
  onUpdateQuantityItemsSuccess(success : string) {

    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM;
    this.messageService.message(message);

    let workItemId = this.workItemId;
    let workItemData = this.workItemsList.filter(
      function( workItemData: any){
        return workItemData.rateAnalysisId === workItemId;
      });
    // this.commonService.calculateTotalOfQuantityItemDetails(workItemData[0]);
    if(workItemData[0].quantity.total !== 0) {
      workItemData[0].quantity.isEstimated = true;
      if(workItemData[0].quantity.isEstimated && workItemData[0].rate.isEstimated) {
        workItemData[0].amount = this.commonService.calculateAmountOfWorkItem(workItemData[0].quantity.total,
          workItemData[0].rate.total);
      }
    } else {
      workItemData[0].quantity.isEstimated = false;
      workItemData[0].amount = 0;
    }

    let categoriesTotal= this.commonService.totalCalculationOfCategories(this.categoryDetails,
      this.categoryRateAnalysisId, this.workItemsList);
    this.categoriesTotalAmount.emit(categoriesTotal);
    this.loaderService.stop();
    this.closeQuantityTab();
  }
  closeQuantityTab() {
    this.closeQuantityView.emit('');
  }

  closeInnerViewTab() {
    this.closeInnerView.emit();
  }
  onUpdateQuantityItemsFailure(error: any) {
    var message = new Message();
    message.isError = true;
    message.error_msg = Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
    this.messageService.message(message);
    this.loaderService.stop();
  }
  getButton() {
    return Button;
  }
  getValueConstant() {
    return ValueConstant;
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
