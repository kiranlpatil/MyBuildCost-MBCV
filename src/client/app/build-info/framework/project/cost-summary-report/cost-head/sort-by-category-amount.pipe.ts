import { Pipe, PipeTransform } from '@angular/core';
import {Category} from '../../../model/category';
@Pipe({name: 'sortByCategoryAmount', pure: false})

export class SortByCategoryAmountPipe implements PipeTransform {
  transform(categories: Array<any>, operation?: string, args: any[] = null): any {
    if (categories === null) {
      return null;
    }
    if(categories !== undefined) {
      var sortArray = categories.map(
        function(data, idx){
        return {idx:idx, data:data};
      });

      sortArray.sort((a: any, b: any) => {
        if (Number(a.data.amount) > Number(b.data.amount)) {
          return -1;
        } else if (Number(a.data.amount) < Number(b.data.amount)) {
          return 1;
        } else {
          return a.idx - b.idx;
        }
      });
      var categories = sortArray.map(function(val){
        return val.data;
      });
    }

    return categories;
  }
}
