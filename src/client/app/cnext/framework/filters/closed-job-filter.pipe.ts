import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'closedJobFilter', pure: false})

export class ClosedJobFilter implements PipeTransform {


  transform(array:Array<any>, args:any):Array<any> {
    if (!args) {
     return array.filter(item => (!item.isJobPostClosed));
    }else if (args) {
      return array;
    }
    return array;
  }
}
