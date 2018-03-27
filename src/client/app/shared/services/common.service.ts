import { Injectable } from '@angular/core';
import { Category } from '../../../app/build-info/framework/model/category';
import { WorkItem } from '../../../app/build-info/framework/model/work-item';
import { ValueConstant } from '../constants';

@Injectable()
export class CommonService {

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
          categoryTotalAmount = parseFloat((categoryTotalAmount + workItemData.amount
          ).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        }
        categoryData.amount = categoryTotalAmount;
      }
      categoryDetailsTotalAmount = parseFloat((categoryDetailsTotalAmount + categoryData.amount
      ).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
    }
    return categoryDetailsTotalAmount;
  }

  calculateAmountOfWorkItem(totalQuantity : number, totalRate : number) {
    return this.decimalConversion(totalQuantity * totalRate);
  }

  decimalConversion(value : number) {
    return parseFloat((value).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
  }
}
