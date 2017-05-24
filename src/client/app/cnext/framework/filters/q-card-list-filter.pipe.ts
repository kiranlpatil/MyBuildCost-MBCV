import {Pipe, PipeTransform} from '@angular/core';
import {CandidateFilter} from "../model/candidate-filter";
import {CandidateQCard} from "../model/candidateQcard";

@Pipe({name: 'dashboardfilter', pure: false})

export class QCardListFilterPipe implements PipeTransform {


  transform(array: Array<CandidateQCard>, args: CandidateFilter,qCardCount:any): Array<any> {
    if (array == null) {
      return null;
    }

    if (args) {
      var result:any;
      result = array.filter(item => eval(args.query));
      qCardCount.count = result.length;
      return result;
    }
    return array;
  }
}
