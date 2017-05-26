import {Pipe, PipeTransform} from "@angular/core";
import {CandidateQCard} from "../model/candidateQcard";
import {ValueConstant} from "../../../framework/shared/constants";

@Pipe({name: 'candidatematching', pure: false})

export class RecuirterQCardMatchingPipe implements PipeTransform {

  transform(array: Array<CandidateQCard>, args: any, totalQCardMatches:any): Array<any> {

    var defaultMatch = ValueConstant.VALUE_FOR_CNDIDATES_PERCENT_MATCHING_LOWER_BOUND;
    var result:CandidateQCard[];
    if (array == null) {
      return null;
    }
    if (args == 'aboveMatch' || args == null) {
      result = array.filter(item => ((item.exact_matching + item.above_one_step_matching) >= defaultMatch));
      totalQCardMatches.count = result.length;
      return result;
    }

    if (args == 'belowMatch') {
      result = array.filter(item => ((item.below_one_step_matching
      + item.above_one_step_matching + item.exact_matching) >= defaultMatch));
      totalQCardMatches.count = result.length;
      return result;
    }

    return array;
  }
}
