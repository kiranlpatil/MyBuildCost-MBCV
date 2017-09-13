import {Pipe, PipeTransform} from "@angular/core";
import {CandidateQCard} from "../model/candidateQcard";
import {ValueConstant} from "../../../shared/constants";

@Pipe({name: 'qcardmatching', pure: false})

export class RecuirterQCardMatchingPipe implements PipeTransform {

  transform(array: Array<CandidateQCard>, args: any, totalQCardMatches: any, cartType: any): Array<any> {

    var defaultMatch = ValueConstant.VALUE_FOR_CANDIDATES_PERCENT_MATCHING_LOWER_BOUND;
    var result: CandidateQCard[];
    if (array === null) {
      return null;
    }
    if (cartType == 'matchedList') {
      if (args == 'aboveMatch') {
        result = array.filter(item => ((item.exact_matching + item.above_one_step_matching) >= defaultMatch));
        result.sort((a: CandidateQCard, b: CandidateQCard) => {
          if (Number(a.exact_matching + a.above_one_step_matching) > Number(b.exact_matching + b.above_one_step_matching)) {
            return -1;
          } else if (Number(a.exact_matching + a.above_one_step_matching) < Number(b.exact_matching + b.above_one_step_matching)) {
            return 1;
          } else {
            return 0;
          }
        });
        totalQCardMatches.count = result.length;
        return result;
      }

      if (args == 'belowMatch') {
        //result = array.filter(item => ((item.below_one_step_matching + item.above_one_step_matching + item.exact_matching) >= defaultMatch));
        result = array.filter(item => ((item.matching) >= defaultMatch));
        totalQCardMatches.count = result.length;
        return result;
      }
    }
    totalQCardMatches.count = array.length;
    return array;
  }
}
