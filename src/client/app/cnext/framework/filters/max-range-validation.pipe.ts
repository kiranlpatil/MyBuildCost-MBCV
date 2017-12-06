import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'maxrange', 'pure': false})

export class MaxRangeValidation implements PipeTransform {

  transform(array: Array<any>, args: string) {

    if (args) {
      return array.filter(item => (Number(item) >= Number(args)));
    }

    return array;
  }

}
