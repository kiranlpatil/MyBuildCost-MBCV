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
  quantityDetails=new QuantityDetails();
  ngOnInit() {
    if(this.steelQuantityItems.length === 0) {
      this.addQuantityItem();
    }
    this.totalDiamterQuantity=new SteelQuantityItems();
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

  getTotalDiameterQuantity(diameter :number) {
    let tempArray:any;
   for(let steelQuantityItemIndex in this.steelQuantityItems) {
    let steelQuantityItem: any =  this.steelQuantityItems[steelQuantityItemIndex];
    if (diameter === parseInt(this.steelQuantityItems[steelQuantityItemIndex].diameter) && this.steelQuantityItems[steelQuantityItemIndex].weight != 0) {
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
       (<any>this.totalDiamterQuantity.totalWeightOfDiameter)={};
     }
    (<any>this.totalDiamterQuantity.totalWeightOfDiameter)[diameter]=tempArray[diameter].reduce((acc:any, val:any) => { return acc + val; });
    return tempArray[diameter].reduce((acc:any, val:any) => { return acc + val; });
  }
    return 0;
  }
  getQuantityTotal():number {
    let total:number=0;
    for(let diameter in this.totalDiamterQuantity.totalWeightOfDiameter) {
      total+=parseInt((<any>this.totalDiamterQuantity.totalWeightOfDiameter)[diameter]);
    }
    this.quantityDetails.total=total;
    return total;
  }
  addQuantityItem() {
    this.steelQuantityItems.push(new SteelQuantityItem('',0,0,0,0));
  }
  deleteQuantityItem(index:number) {
    this.totalDiamterQuantity.totalWeightOfDiameter[this.steelQuantityItems[index].diameter]=
      this.totalDiamterQuantity.totalWeightOfDiameter[this.steelQuantityItems[index].diameter]- this.steelQuantityItems[index].weight;
    this.steelQuantityItems.splice(index,1);
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

   setTotalDiameterQuantity(diameter: any, weight: number) {
    if(this.totalDiamterQuantity.totalWeightOfDiameter == undefined) {
      this.totalDiamterQuantity.totalWeightOfDiameter= {};
    }
    if(this.totalDiamterQuantity.totalWeightOfDiameter[diameter] == undefined) {
      this.totalDiamterQuantity.totalWeightOfDiameter[diameter]=0;
    }
    this.totalDiamterQuantity.totalWeightOfDiameter[diameter]+=weight;
  }
}
