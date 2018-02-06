import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import {
  AppSettings,
  Label,
  Button,
  Headings,
  NavigationRoutes, Messages
} from '../../../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService,
  Message, MessageService } from '../../../../../../shared/index';
import { GetRateService } from './get-rate.service';
import { CustomHttp } from '../../../../../../shared/services/http/custom.http';
import { FormGroup } from '@angular/forms';
import { Project } from '../../../../model/project';
import { Rate } from '../../../../model/rate';
import Any = jasmine.Any;

@Component({
  moduleId: module.id,
  selector: 'bi-rate-items',
  templateUrl: 'get-rate.component.html'
})

export class GetRateComponent implements OnInit {

  @Input() rateItemsArray : any;
  @Input() rateItemsObject : any;
  @Input() subCategoryRateAnalysisId : number;
  @Output() refreshDataList = new EventEmitter();

  projectId : string;
  buildingId: string;
  buildingName: string;
  itemName: string;
  costHead: string;
  costheadId:number;
  subCategoryId: number;
  subCategoryDetails: any;
  quantityTotal: number = 0;
  quanitytNumbersTotal: number = 0;
  lengthTotal: number = 0;
  breadthTotal: number = 0;
  heightTotal: number = 0;
  totalAmount:number=0;
  totalRate:number=0;
  totalQuantity:number=0;
  total:number=0;
  rateIArray: any;
  quantity:number=0;
  unit:string='';
  workItemId:number;
  showSubcategoryListvar: boolean = false;
  rateTotal : number = 0;

  constructor(private getRateService : GetRateService, private activatedRoute : ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log('Inside getRateService component.');
  }

  changeQuantity(quantity:string,k:number) {
    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;
    /*this.rateItemsArray[k].quantity=parseInt(quantity);
    for(let i=0;i<this.rateItemsArray.length;i++) {
      this.totalAmount= this.totalAmount+( this.rateItemsArray[i].quantity*this.rateItemsArray[i].rate);
      this.totalRate= this.totalRate+this.rateItemsArray[i].rate;
      this.totalQuantity=this.totalQuantity+this.rateItemsArray[i].quantity;
    }
    this.rateTotal= this.totalAmount/this.totalQuantity;*/
  }


  changeRate(rate:any, k:number) {
    this.totalAmount=0;
    this.totalRate=0;
    this.totalQuantity=0;
    /*this.rateItemsArray[k].rate= parseInt(rate);
    for(let i=0;i<this.rateItemsArray.length;i++) {
      this.totalAmount= this.totalAmount+( this.rateItemsArray[i].quantity*this.rateItemsArray[i].rate);
      this.totalRate= this.totalRate+this.rateItemsArray[i].rate;
      this.totalQuantity=this.totalQuantity+this.rateItemsArray[i].quantity;
    }
    this.rateTotal= this.totalAmount/this.totalQuantity;*/
  }

  updateRate(rateItemsArray:any) {

    let costHeadId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID);
    let workItemId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_WORKITEM_ID);
    let rate = new Rate();
    rate.total = this.rateItemsObject.total;
    rate.quantity = this.rateItemsObject.quantity;
    rate.unit = this.rateItemsObject.unit;
    rate.item = rateItemsArray;

    this.getRateService.updateRateItems(parseInt(costHeadId), this.subCategoryRateAnalysisId,
      parseInt(workItemId), rate).subscribe(
      rateItem => this.onUpdateRateItemsSuccess(rateItem),
      error => this.onUpdateRateItemsFail(error)
    );
  }

  onUpdateRateItemsSuccess(rateItem: any) {
    console.log('Rate updated successfully');
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_RATE;
    this.messageService.message(message);
    this.refreshDataList.emit();
  }

  onUpdateRateItemsFail(error: any) {
    console.log(error);
  }

}
