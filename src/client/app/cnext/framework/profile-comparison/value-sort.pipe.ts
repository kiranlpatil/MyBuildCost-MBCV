import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueSortFilter'
})
@Injectable()
export class ValueSortFilterPipe implements PipeTransform {
  transform(array: any[], args: any[]): Array<any> {
    return array.sort((a, b) => {
      return Number(a.matchingPercentage) < Number(b.matchingPercentage) ? 1 : -1})
  }
}
