import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'minrange', 'pure': false})

export class MinRangeValidation implements PipeTransform {

  transform(array: Array<any>, args: string) {

    if (args) {
      return array.filter(item => (Number(item) <= Number(args)));
    }

    return array;
  }
}
