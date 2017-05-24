import {Pipe, PipeTransform} from '@angular/core';
import {CandidateFilter} from "../model/candidate-filter";
import {CandidateQCard} from "../model/candidateQcard";

@Pipe({name: 'dashboardfilter', pure: false})

export class DashboardFilterPipe implements PipeTransform {


  transform(array: Array<CandidateQCard>, args: CandidateFilter): Array<any> {
    if (array == null) {
      return null;
    }

    if (args) {
      return array.filter(item => eval(args.query)
      );
    }
    return array;
  }
}
