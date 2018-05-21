import { Pipe, PipeTransform } from '@angular/core';
import {Category} from '../../../model/category';
@Pipe({name: 'sortByCategoryAmount', pure: false})

export class SortByCategoryAmountPipe implements PipeTransform {
  transform(categories: Array<Category>, operation?: string, args: any[] = null): any {
    if(categories !== undefined) {
      categories.sort((a: Category, b: Category) => {
        if (Number(a.amount) > Number(b.amount)) {
          return -1;
        } else if (Number(a.amount) < Number(b.amount)) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return categories;
  }
}
