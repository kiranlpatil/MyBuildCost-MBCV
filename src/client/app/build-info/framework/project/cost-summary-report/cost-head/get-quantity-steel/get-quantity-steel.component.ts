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
import {SteelQuantityItem} from "../../../../model/steelQuantityItem";
import {SteelQuantityItems} from "../../../../model/SteelQuantityItems";


@Component({
  moduleId: module.id,
  selector: 'bi-get-quantity-steel',
  templateUrl: 'get-quantity-steel.component.html',
  styleUrls: ['get-quantity-steel.component.scss'],
})

export class GetSteelQuantityComponent implements OnInit {
  diameterValuesArray:any[] =ValueConstant.STEEL_DIAMETER_VALUES.slice();
  steelQuantityItems: Array<SteelQuantityItem>=new Array<SteelQuantityItem>();
  totalDiamterQuantity:SteelQuantityItems;
  ngOnInit() {
    if(this.steelQuantityItems.length === 0) {
      this.addQuantityItem();
    }
    this.totalDiamterQuantity=new SteelQuantityItems(0,0,0,0,0,0,0,0,0);
    }

    getDiameterQuantityFun(steelQuantityItemIndex:number,diameter:any,value:string,totalString:string) {
    let steelQuantityItem: any = this.steelQuantityItems[steelQuantityItemIndex];
    if (diameter === parseInt(this.steelQuantityItems[steelQuantityItemIndex].diameter)) {
      steelQuantityItem[value] =
        (0.000628 * diameter * diameter * this.steelQuantityItems[steelQuantityItemIndex].length *
          this.steelQuantityItems[steelQuantityItemIndex].nos) * 10;
      return steelQuantityItem[ValueConstant.STEEL_DIAMETER_STRING_VALUES[ValueConstant.STEEL_DIAMETER_VALUES.indexOf(diameter)]];
  }
    return 0;
  }

  getTotalDiameterQuantityFun(diameter :number,value:string,totalString:string) {
  let tempArray:any;
  for(let steelQuantityItemIndex in this.steelQuantityItems) {
    let steelQuantityItem: any =  this.steelQuantityItems[steelQuantityItemIndex];
    if (diameter === parseInt(this.steelQuantityItems[steelQuantityItemIndex].diameter) && steelQuantityItem[value] != 0) {
      if(tempArray == undefined) {
        tempArray= {};
      }
      if(tempArray[totalString]==undefined) {
        tempArray[totalString]=[];
      }
      tempArray[totalString].push(steelQuantityItem[value]);
    }
  }
  if(tempArray && tempArray[totalString] ) {
    console.log(tempArray[totalString].reduce((acc:any, val:any) => { return acc + val; }));
    (<any>this.totalDiamterQuantity)[totalString]=tempArray[totalString].reduce((acc:any, val:any) => { return acc + val; });
    console.log(this.totalDiamterQuantity);
    this.totalDiamterQuantity.totalWeight=this.totalDiamterQuantity.totalWeightOf6mm+this.totalDiamterQuantity.totalWeightOf8mm+
      this.totalDiamterQuantity.totalWeightOf10mm+this.totalDiamterQuantity.totalWeightOf12mm+
      this.totalDiamterQuantity.totalWeightOf16mm+this.totalDiamterQuantity.totalWeightOf20mm+
      this.totalDiamterQuantity.totalWeightOf25mm+this.totalDiamterQuantity.totalWeightOf30mm;
    this.totalDiamterQuantity.steelQuantityItem=this.steelQuantityItems;
    return tempArray[totalString].reduce((acc:any, val:any) => { return acc + val; });
  }
    return 0;
  }

  addQuantityItem() {
    this.steelQuantityItems.push(new SteelQuantityItem('',0,0,0,0,
      0,0,0,0,0,0,0));
  }
  deleteQuantityItem(index:number){
    this.steelQuantityItems.splice(index,1)
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
