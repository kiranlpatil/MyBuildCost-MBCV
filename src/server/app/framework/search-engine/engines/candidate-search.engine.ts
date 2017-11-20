import { SearchEngine } from './search.engine';
import { AppliedFilter } from '../models/input-model/applied-filter';
import { JobDetail } from '../models/output-model/job-detail';
import { ESort } from '../models/input-model/sort-enum';
import { EList } from '../models/input-model/list-enum';
import { CandidateCard } from '../models/output-model/candidate-card';
import CandidateRepository = require('../../dataaccess/repository/candidate.repository');
import {ConstVariables} from "../../shared/sharedconstants";
import {UtilityFunction} from "../../uitility/utility-function";

export class CandidateSearchEngine extends SearchEngine {
  candidate_q_cards: CandidateCard[] = new Array(0);

  getMatchingObjects(criteria: any, callback: (error: any, response: any[]) => void): any {
    let candidateRepository: CandidateRepository = new CandidateRepository();
    candidateRepository.retrieveAndPopulate(criteria, {}, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res);
      }
    });
  }

  buildQCards(objects: any[], jobDetails: JobDetail, sortBy: ESort, listName: EList): any {
    for (let obj of objects) {
      let isFound: boolean = false;
      if (listName === EList.CAN_MATCHED) {
        if (jobDetails.candidateList) {
          for (let list of jobDetails.candidateList) {
            if (list.name === ConstVariables.SHORT_LISTED_CANDIDATE) {
              continue;
            }
            if (list.ids.indexOf(obj._id.toString()) !== -1) {
              isFound = true;
              break;
            }
          }
        }
        if (isFound) {
          continue;
        }
      }
      let candidate_q_card: CandidateCard;
      if (!this.setMustHaveMatrix(jobDetails.capability_matrix, obj.capability_matrix, jobDetails.complexity_must_have_matrix)) {
        continue;
      } else {
        candidate_q_card = <CandidateCard> this.computePercentage(obj.capability_matrix, jobDetails.capability_matrix);
        if(candidate_q_card.exact_matching >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
          if (sortBy !== ESort.BEST_MATCH) {
            if (this.candidate_q_cards.length < 100) {
              this.createQCard(candidate_q_card, obj);
            } else {
              break;
            }
          } else {
            this.createQCard(candidate_q_card, obj);
          }
        }
      }
    }
    if (sortBy === ESort.BEST_MATCH) {
     this.candidate_q_cards = <CandidateCard[]>this.getSortedObjectsByMatchingPercentage(this.candidate_q_cards);
    }
    if(listName !== EList.CAN_CART) {
      this.candidate_q_cards = this.maskQCards(this.candidate_q_cards);
    }
    return this.candidate_q_cards.slice(0, 100);
  }


  setMustHaveMatrix(jobProfile_capability_matrix: any, candidate_capability_matrix: any, complexity_musthave_matrix: any) {
    let isNotSatisfy: boolean = false;
    for (let cap in jobProfile_capability_matrix) {
      if (candidate_capability_matrix && candidate_capability_matrix[cap] && complexity_musthave_matrix && complexity_musthave_matrix[cap]) {
        if (jobProfile_capability_matrix[cap] !== candidate_capability_matrix[cap] &&
          jobProfile_capability_matrix[cap] !== (Number(candidate_capability_matrix[cap].toString()))) {
          isNotSatisfy = true;
          break;
        }
      }
    }
    return !isNotSatisfy;
  }

  buildUserCriteria(filter: AppliedFilter, criteria: any): any {
    let mainQuery: Object;
    if (filter.location !== undefined && filter.location !== '') {
      criteria.$or = [{'location.city': filter.location}];
    }
    if (filter.education && filter.education.length > 0) {
      criteria['professionalDetails.education'] = {$in: filter.education};
    }
    if (filter.proficiencies && filter.proficiencies.length > 0) {
      criteria['proficiencies'] = {$in: filter.proficiencies};
    }
    if (filter.interestedIndustries && filter.interestedIndustries.length > 0) {
      criteria['interestedIndustries'] = {$in: filter.interestedIndustries};
    }
    if (filter.joinTime !== undefined && filter.joinTime !== '') {
      criteria['professionalDetails.noticePeriod'] = filter.joinTime;
    }
    if (filter.minSalary !== undefined && filter.minSalary.toString() !== '' &&
      filter.maxSalary !== undefined && filter.maxSalary.toString() !== '') {
      criteria['professionalDetails.currentSalary'] = {
        $gte: Number(filter.minSalary),
        $lte: Number(filter.maxSalary)
      };
    }
    if (filter.minExperience !== undefined && filter.minExperience.toString() !== '' &&
      filter.maxExperience !== undefined && filter.maxExperience.toString() !== '') {
      criteria['professionalDetails.experience'] = {
        $gte: Number(filter.minExperience),
        $lte: Number(filter.maxExperience)
      };
    }
    return this.getSortedCriteria(filter.sortBy, criteria);
  }

  getSortedCriteria(sortBy : ESort, criteria : any) : Object {
    let mainQuery: any;
    switch (sortBy) {
      case ESort.SALARY:
        mainQuery = {'$query': criteria, '$orderby': {'professionalDetails.currentSalary': -1}};
        break;
      case ESort.EXPERIENCE:
        mainQuery = {'$query': criteria, '$orderby': {'professionalDetails.experience': -1}};
        break;
      case ESort.BEST_MATCH :
        mainQuery = criteria;
        break;
      default :
        mainQuery = criteria;
        break;
    }
    return mainQuery;
  }


  buildBusinessCriteria(details: JobDetail): any {
    let criteria: any = {
      'industry.name': details.industryName,
      'isVisible': true,
    };
    if (details.interestedIndustries && details.interestedIndustries.indexOf('None')) {
      criteria['interestedIndustries'] = {$in: details.interestedIndustries};
    }
    if (details.relevantIndustries && details.relevantIndustries.length > 0) {
      let industries = details.relevantIndustries;
      industries.push(details.industryName);
      criteria['industry.name'] = {$in: industries};
    }
    criteria.$or = [
      {'professionalDetails.relocate': 'Yes'},
      {'location.city': details.city}];
    return criteria;
  }

  createQCard(candidate_q_card: CandidateCard, candidate: any): void {
    let candidate_card = new CandidateCard(candidate.userId.first_name,
      candidate.userId.last_name, candidate.professionalDetails.currentSalary,
      candidate.professionalDetails.experience, candidate.userId.picture, candidate._id,
      candidate_q_card.above_one_step_matching, candidate_q_card.exact_matching, candidate.location.city,
      candidate.proficiencies);
    this.candidate_q_cards.push(candidate_card);
  }

  maskQCards(q_cards: any []): any[] {
      for(let qCard in q_cards) {
        q_cards[qCard].last_name =  UtilityFunction.valueHide(q_cards[qCard].last_name);
      }
    return q_cards;
  }

}
