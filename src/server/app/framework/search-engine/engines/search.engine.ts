import { AppliedFilter } from '../models/input-model/applied-filter';
import { BaseDetail } from '../models/output-model/base-detail';
import { ConstVariables } from '../../shared/sharedconstants';
import { QCard } from '../models/output-model/q-card';
import { ESort } from '../models/input-model/sort-enum';
import { EList } from '../models/input-model/list-enum';
import {CandidateCard} from "../models/output-model/candidate-card";
import {UtilityFunction} from "../../uitility/utility-function";
export abstract class SearchEngine {

  search() {
    console.log('In Search');
  }

  abstract buildUserCriteria(filter : AppliedFilter, criteria : any) : any;

  abstract buildBusinessCriteria(details : BaseDetail): any;

  abstract getSortedCriteria(sortBy : any, criteria : any) : Object ;

  abstract buildQCards(objects : any[], jobDetails : BaseDetail,sortBy : ESort, listName: EList, mustHaveComplexity?: boolean) : any ;

  abstract getMatchingObjects(criteria : any, sortingQuery: any, callback : (error : any, response : any[]) => void) : void;

  abstract createQCard(q_card : QCard, user : any): void;

  computePercentage(candidate_capability_matrix : any , job_capability_matrix :any) : QCard {
    let q_card = new QCard();
    let count =0;
    for (let cap in job_capability_matrix) {
        if (job_capability_matrix[cap] === -1 || job_capability_matrix[cap] === 0 ||
          job_capability_matrix[cap] === undefined) {
        } else if (candidate_capability_matrix[cap] && (Number(job_capability_matrix[cap].toString()) === Number(candidate_capability_matrix[cap].toString()))) {
          q_card.exact_matching += 1;
          count++;
        } else if (candidate_capability_matrix[cap] && (Number(job_capability_matrix[cap].toString()) === (Number(candidate_capability_matrix[cap].toString()) -
            ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO))) {
          q_card.above_one_step_matching += 1;
          count++;
        } else if (candidate_capability_matrix[cap] && (Number(job_capability_matrix[cap].toString()) === (Number(candidate_capability_matrix[cap].toString()) +
            ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO))) {
          count++;
        } else {
          count++;
        }
    }
    q_card.above_one_step_matching = (q_card.above_one_step_matching / count) * 100;
    q_card.exact_matching = (q_card.exact_matching / count) * 100;
    return q_card;


  }

  getSortedObjectsByMatchingPercentage( q_cards : QCard [] ) : QCard[] {
    q_cards.sort((first: QCard, second: QCard): number => {
      if ((first.above_one_step_matching + first.exact_matching) > (second.above_one_step_matching + second.exact_matching)) {
        return -1;
      }
      if ((first.above_one_step_matching + first.exact_matching) < (second.above_one_step_matching + second.exact_matching)) {
        return 1;
      }
      return 0;
    });
    return q_cards;
  }

  /*maskQCards(q_cards: any []): any[] {
    for(let qCard in q_cards) {
      q_cards[qCard].last_name =  UtilityFunction.valueHide(q_cards[qCard].last_name);
    }
    return q_cards;
  }*/

}
