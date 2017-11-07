import {ConstVariables} from '../../shared/sharedconstants';

export class CommonSearchService {
  static setQcardData(qcard : any, jobProfile : any, candidate : any) {
    let count =0;
    for (let cap in jobProfile.capability_matrix) {
      if (jobProfile.capability_matrix[cap] == -1 || jobProfile.capability_matrix[cap] == 0 ||
        jobProfile.capability_matrix[cap] == undefined) {
      } else if (jobProfile.capability_matrix[cap] == candidate.capability_matrix[cap]) {
        qcard.exact_matching += 1;
        count++;
      } else if (jobProfile.capability_matrix[cap] == (Number(candidate.capability_matrix[cap]) -
        ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
        qcard.above_one_step_matching += 1;
        count++;
      } else if (jobProfile.capability_matrix[cap] == (Number(candidate.capability_matrix[cap]) +
        ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
        qcard.below_one_step_matching += 1;
        count++;
      } else {
        count++;
      }
    }
    qcard.above_one_step_matching = (qcard.above_one_step_matching / count) * 100;
    qcard.below_one_step_matching = (qcard.below_one_step_matching / count) * 100;
    qcard.exact_matching = (qcard.exact_matching / count) * 100;
    qcard.matching = qcard.above_one_step_matching +
      qcard.below_one_step_matching + qcard.exact_matching;
    return qcard;
  }

  static setMustHaveMatrix(jobProfile: any, candidate : any, q_card_view: any) {
    for(let cap in jobProfile.capability_matrix) {
      if (jobProfile.complexity_musthave_matrix == -1 ||
        jobProfile.complexity_musthave_matrix == undefined || jobProfile.capability_matrix[cap] == 0) {
        q_card_view.complexityIsMustHave = false;
      } else if(jobProfile.complexity_musthave_matrix[cap]) {
        if(jobProfile.capability_matrix[cap] == candidate.capability_matrix[cap]) {
          q_card_view.complexityIsMustHave = jobProfile.complexity_musthave_matrix[cap];
        } else {
          q_card_view.complexityIsMustHave = false;
        }
      }
    }
    return q_card_view;
  }

}
