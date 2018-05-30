import { Pipe, PipeTransform } from '@angular/core';
import { MaterialTakeOffElements } from '../../../../shared/constants';
@Pipe({name: 'keys', pure: false})

export class CostSummaryPipe implements PipeTransform {
  transform(value: any, operation : string, args: any[] = null): any {
    if(value !== undefined) {
      if(operation === MaterialTakeOffElements.SORT) {
        return Object.keys(value).sort(function (a, b) {
          return a.toLowerCase().localeCompare(b.toLowerCase());
        });
      } else if(operation === MaterialTakeOffElements.CHECK_SUB_CONTENT_PRESENT) {
         return (Object.keys(value).length !== 0 ? true : false);
      }else {
        return Object.keys(value);
      }
    }
  }
}
