import {Pipe, PipeTransform} from '@angular/core';
import {CandidateQCard} from "../model/candidateQcard";
import {QCardFilter} from "../model/q-card-filter";

@Pipe({name: 'dashboardfilter', pure: false})

export class QCardListFilterPipe implements PipeTransform {


  transform(array: Array<CandidateQCard>, args: QCardFilter,qCardCount:any): Array<any> {
    if (array == null) {
      return null;
    }

    if (args) {
      var result:CandidateQCard[];
      result = array.filter(item => eval(args.query));
      qCardCount.count = result.length;
      return result;
    }
    return array;
  }
}
