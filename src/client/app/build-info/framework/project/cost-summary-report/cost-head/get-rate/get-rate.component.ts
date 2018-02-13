import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {
  AppSettings,
  Label,
  Button,
  Headings,
  NavigationRoutes, Messages
} from '../../../../../../shared/constants';
import {
  API, BaseService, SessionStorage, SessionStorageService,
  Message, MessageService
} from '../../../../../../shared/index';
import {GetRateService} from './get-rate.service';
import {CustomHttp} from '../../../../../../shared/services/http/custom.http';
import {FormGroup} from '@angular/forms';
import {Project} from '../../../../model/project';
import {Rate} from '../../../../model/rate';
import Any = jasmine.Any;

@Component({
  moduleId: module.id,
  selector: 'bi-rate-items',
  templateUrl: 'get-rate.component.html'
})

export class GetRateComponent implements OnInit {

  @Input() rateItemsArray: any;
  @Input() rateItemsObject: any;
  @Input() subCategoryRateAnalysisId: number;
  @Input() totalQuantity: number;
  @Input() totalAmount: number;
  @Input() totalRate: number;
  @Output() refreshDataList = new EventEmitter();

  projectId: string;
  buildingId: string;
  buildingName: string;
  itemName: string;
  costHead: string;
  costheadId: number;
  subCategoryId: number;
  subCategoryDetails: any;
  workItem: any;
  quantityTotal: number = 0;
  quanitytNumbersTotal: number = 0;
  lengthTotal: number = 0;
  breadthTotal: number = 0;
  heightTotal: number = 0;
  /*totalAmount:number=0;*/
  /*totalRate:number=0;*/
  /*totalQuantity:number=0;*/
  total: number = 0;
  rateIArray: any;
  quantity: number = 0;
  /*unit:string='';*/
  workItemId: number;
  showSubcategoryListvar: boolean = false;
  rateTotal: number = 0;
  quantityIncrement: number = 1;
  previousTotalQuantity: number = 1;
  totalItemRateQuantity: number = 0;

  constructor(private getRateService: GetRateService, private activatedRoute: ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log('Inside getRateService component.');
  }

  changeQuantity(quantity: any, k: number) {
    this.rateItemsArray.item[k].quantity = parseFloat(quantity);
    this.calculateTotal();
  }

  //
  changeRate(rate: any, k: number) {
    this.rateItemsArray.item[k].rate = parseFloat(rate);
    this.calculateTotal();
  }

  //
  calculateTotal() {
    this.totalAmount = 0;
    this.totalRate = 0.0;
    this.totalQuantity = 0.0;
    for (let i = 0; i < this.rateItemsArray.item.length; i++) {
      this.rateItemsArray.item[i].quantity = this.rateItemsArray.item[i].quantity * this.quantityIncrement;
      this.totalAmount = this.totalAmount + (this.rateItemsArray.item[i].quantity * this.rateItemsArray.item[i].rate);
      this.totalRate = this.totalRate + this.rateItemsArray.item[i].rate;
      this.totalQuantity = this.totalQuantity + this.rateItemsArray.item[i].quantity;
    }

    this.rateItemsArray.total = this.totalAmount / this.totalQuantity;
  }

  //
  updateRate(rateItemsArray: any) {
    let costHeadId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID);
    let workItemId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID);
    let rate = new Rate();
    rate.rateFromRateAnalysis = parseFloat(rateItemsArray.rateFromRateAnalysis);
    rate.total = parseFloat(rateItemsArray.total).toFixed(2);
    rate.quantity = rateItemsArray.quantity;
    rate.unit = rateItemsArray.unit;
    rate.item = rateItemsArray.item;

    this.getRateService.updateRateItems(parseInt(costHeadId), this.subCategoryRateAnalysisId,
      parseInt(workItemId), rate).subscribe(
      rateItem => this.onUpdateRateItemsSuccess(rateItem),
      error => this.onUpdateRateItemsFail(error)
    );
  }

  //
  onUpdateRateItemsSuccess(rateItem: any) {
    console.log('Rate updated successfully');
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_RATE;
    this.messageService.message(message);
    this.refreshDataList.emit();
  }

  //
  onUpdateRateItemsFail(error: any) {
    console.log(error);
  }

  //
  onTotalQuantityChange(newTotalQuantity: number) {
    if (newTotalQuantity === 0 || newTotalQuantity === null){
      newTotalQuantity=1;
      this.totalItemRateQuantity = newTotalQuantity;
      this.rateItemsArray.quantity = newTotalQuantity;
    } else {
      console.log('newTotalQuantity : ' + newTotalQuantity);
      this.quantityIncrement = newTotalQuantity / this.previousTotalQuantity;
      console.log('quantityIncrement : ' + this.quantityIncrement);
      this.calculateTotal();
      this.totalItemRateQuantity = newTotalQuantity;
      this.rateItemsArray.quantity = newTotalQuantity;
    }

  }

  //
  getPreviousQuantity(previousTotalQuantity: number) {
    console.log('previousTotalQuantity : ' + previousTotalQuantity);
    this.previousTotalQuantity = previousTotalQuantity;
  }

}
