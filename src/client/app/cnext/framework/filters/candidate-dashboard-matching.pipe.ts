
import {Pipe, PipeTransform} from "@angular/core";
import {CandidateQCard} from "../model/candidateQcard";

@Pipe({name:'candidatematching', pure: false})

export class CandidateDashboardMatchingPipe implements PipeTransform {

  transform(array: Array<CandidateQCard>, args: any): Array<any> {

    var defaultMatch = 60;

    if (args == 'aboveMatch' || args == 'undefined') {
      return array.filter(item => ((item.below_one_step_matching + item.above_one_step_matching) >= defaultMatch));
    }

    if(args == 'belowMatch') {
      return array.filter(item => ((item.below_one_step_matching + item.above_one_step_matching + item.exact_matching) <= defaultMatch));
    }

    return array;
  }
}
