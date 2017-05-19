
import {Pipe, PipeTransform} from "@angular/core";
import {CandidateQCard} from "../model/candidateQcard";
import {ValueConstant} from "../../../framework/shared/constants";

@Pipe({name:'candidatematching', pure: false})

export class CandidateDashboardMatchingPipe implements PipeTransform {

  transform(array: Array<CandidateQCard>, args: any): Array<any> {

    var defaultMatch = ValueConstant.VALUE_FOR_CNDIDATES_MATCHING;
    if (array == null) {
      return null;
    }
    if (args == 'aboveMatch' || args == 'undefined') {
      return array.filter(item => ((item.exact_matching + item.above_one_step_matching) >= defaultMatch));
    }

    if(args == 'belowMatch') {
      return array.filter(item => ((item.below_one_step_matching + item.above_one_step_matching + item.exact_matching) >= defaultMatch));
    }

    return array;
  }
}
