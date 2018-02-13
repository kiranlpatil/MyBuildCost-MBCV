import { Injectable } from '@angular/core';


@Injectable()
export class CommonService {

  goBack() {
    window.history.go(-1);
  }

  removeDuplicateItmes(itemList : Array<any>, selectedItemList: Array<any>):any {
    for(let selectedItem=0; selectedItem<selectedItemList.length; selectedItem++) {
      for(let itemIndex=0; itemIndex < itemList.length; itemIndex++) {
        if(itemList[itemIndex].rateAnalysisId === selectedItemList[selectedItem].rateAnalysisId) {
          itemList.splice(itemIndex,1);
        }
      }
    }
    return itemList;
  }
}
