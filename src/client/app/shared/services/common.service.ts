import { Injectable } from '@angular/core';
import { Category } from '../../../app/build-info/framework/model/category';
import { WorkItem } from '../../../app/build-info/framework/model/work-item';
import { ValueConstant } from '../constants';
import { QuantityDetails } from '../../build-info/framework/model/quantity-details';
import {Subject} from "rxjs/Subject";
import {
  AddBuildingPackageDetails
} from "../../build-info/framework/model/add-building-package-details";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class CommonService {
  CommonService = new BehaviorSubject<any>('null');
  deleteEvent$ = this.CommonService.asObservable();
  updatepackageInfo$ = this.CommonService.asObservable();

  change(values:any) {
    this.CommonService.next(values);
  }

  updatePurchasepackageInfo(packageInfo : any) {
    if(packageInfo !== null) {
      this.CommonService.next(packageInfo);
    }
  }

  goBack() {
    window.history.go(-1);
  }

  removeDuplicateItmes(itemList : Array<any>, selectedItemList: Array<any>):any {
    if(selectedItemList.length !== 0) {
      for(let selectedItem=0; selectedItem<selectedItemList.length; selectedItem++) {
        for(let itemIndex=0; itemIndex < itemList.length; itemIndex++) {
          if(itemList[itemIndex].rateAnalysisId === selectedItemList[selectedItem].rateAnalysisId) {
            itemList.splice(itemIndex,1);
          }
        }
      }
    }
    return itemList;
  }

  totalCalculationOfCategories(categoryDetails : Array<Category>, categoryRateAnalysisId :number, workItemsList : Array<WorkItem>) {
    let categoryDetailsTotalAmount = 0;
    for(let categoryData of categoryDetails) {
      if(categoryData.rateAnalysisId === categoryRateAnalysisId) {
        let categoryTotalAmount = 0;
        for(let workItemData of workItemsList) {
          categoryTotalAmount =categoryTotalAmount + workItemData.amount;
        }
        categoryData.amount = categoryTotalAmount;
      }
      categoryDetailsTotalAmount = categoryDetailsTotalAmount + categoryData.amount;
    }
    return categoryDetailsTotalAmount;
  }

  calculateTotalOfQuantityItemDetails(workItemData : WorkItem) {
    let quantityItemDetailsTotal = 0;
    for(let quantityItemDetail of workItemData.quantity.quantityItemDetails) {
      this.calculateTotalOfQuantityItems(quantityItemDetail);
      quantityItemDetailsTotal = quantityItemDetailsTotal + quantityItemDetail.total;
    }
    workItemData.quantity.total = quantityItemDetailsTotal;
  }

  calculateTotalOfQuantityItems(quantityItemDetail : QuantityDetails) {
    let quantityItemTotal = 0;
    for(let quantityItemData of quantityItemDetail.quantityItems) {
      quantityItemTotal = quantityItemTotal + quantityItemData.quantity;
    }
    quantityItemDetail.total = quantityItemTotal;
  }

  calculateAmountOfWorkItem(totalQuantity : number, totalRate : number) {
    return (totalQuantity * totalRate);
  }

  decimalConversion(value : number) {
    return parseFloat((value).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
  }

  // downloadToPdf(content : any) {
  //   let contentDiv = document.createElement('div');
  //   contentDiv.innerHTML = content;
  //   contentDiv.setAttribute('id','print-div');
  //   document.getElementById('tpl-app').style.display = 'none';
  //   window.document.body.appendChild(contentDiv);
  //   window.document.close();
  //   window.print();
  //   var elem = document.querySelector('#print-div');
  //   elem.parentNode.removeChild(elem);
  //   document.getElementById('tpl-app').style.display = 'initial';
  // }

  changeQuantityByWorkItemUnit(quantity: number, workItemUnit: string, rateUnit: string) {
    let quantityTotal: number = 0;
    if (workItemUnit === 'Sqm' && rateUnit !== 'Sqm') {
      quantityTotal = quantity * 10.764;
    } else if (workItemUnit === 'Rm' && rateUnit !== 'Rm') {
      quantityTotal = quantity * 3.28;
    } else if (workItemUnit === 'cum' && rateUnit !== 'cum') {
      quantityTotal = quantity * 35.28;
    } else {
      quantityTotal = quantity;
    }
    return quantityTotal;
  }

}
