import {AppliedFilter} from "../models/input-model/applied-filter";
import {CoreMatchingDetail} from "../models/output-model/base-detail";
import {ConstVariables} from "../../shared/sharedconstants";
import {QCard} from "../models/output-model/q-card";
import {EList} from "../models/input-model/list-enum";
import * as mongoose from "mongoose";
export abstract class SearchEngine {

  search() {
    console.log('In Search');
  }

  abstract lookupInIds(detail: CoreMatchingDetail, listName: EList): mongoose.Types.ObjectId[] ;

  abstract getCoreMatchAgainstDetails(id: string, callback: (err: Error, res: CoreMatchingDetail) => void): void;

  abstract buildBusinessCriteria(details: CoreMatchingDetail): any;

  abstract buildUserCriteria(filter: AppliedFilter, criteria: any): any;

  abstract getSortedCriteria(sortBy: any, criteria: any): Object;

  abstract getRequiredFieldNames(): any;

  abstract getMatchingObjects(criteria: any, includedFields: any, sortingQuery: any,
                              callback: (error: any, response: any[]) => void): void;

  abstract buildQCards(objects: any[], jobDetails: CoreMatchingDetail, appliedFilter: AppliedFilter,
                       callback: (error: any, response: any[]) => void): any ;

  computePercentage(candidate_capability_matrix: any, job_capability_matrix: any, id: any): QCard {
    let q_card = new QCard();
    q_card._id = id;
    let count = 0;
    for (let cap in job_capability_matrix) {
      if (job_capability_matrix[cap] === -1 || job_capability_matrix[cap] === '0' ||
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

  getSortedObjectsByMatchingPercentage(q_cards: QCard []): QCard[] {
    return q_cards.sort((first: QCard, second: QCard): number => {
      if ((first.above_one_step_matching + first.exact_matching) > (second.above_one_step_matching + second.exact_matching)) {
        return -1;
      }
      if ((first.above_one_step_matching + first.exact_matching) < (second.above_one_step_matching + second.exact_matching)) {
        return 1;
      }
      return 0;
    });
  }

  /*maskQCards(q_cards: any []): any[] {
   for(let qCard in q_cards) {
   q_cards[qCard].last_name =  UtilityFunction.valueHide(q_cards[qCard].last_name);
   }
   return q_cards;
   }*/

  getMatchingResult(searchEngine: SearchEngine, forId: any, appliedFilters: AppliedFilter,
                    callback: (err: Error, res: any,userId:string) => void): void {
    searchEngine.getCoreMatchAgainstDetails(forId, (err: Error, againstDetails: CoreMatchingDetail) => {
      if (err) {
        callback(err, null,null);
        return;
      }
      let businessCriteria: any = searchEngine.buildBusinessCriteria(againstDetails);

      if (appliedFilters.listName !== EList.CAN_MATCHED) {
        if (appliedFilters.listName !== EList.JOB_MATCHED) {
          let ids = this.lookupInIds(againstDetails, appliedFilters.listName);
          businessCriteria = {'_id': {$in: ids}};
        }
      }

      let mainCriteria = searchEngine.buildUserCriteria(appliedFilters, businessCriteria);
      let sortingQuery = searchEngine.getSortedCriteria(appliedFilters, businessCriteria);
      let includedFields = searchEngine.getRequiredFieldNames();

      searchEngine.getMatchingObjects(mainCriteria, includedFields, sortingQuery, (error: any, response: any[]) => {
        if (error) {
          callback(error, null,againstDetails.userId);
          return;
        }
        searchEngine.buildQCards(response, againstDetails, appliedFilters, (error: any, qcards: any[]) => {
          callback(error, qcards,againstDetails.userId);
        });
      });
    });
  }
}
