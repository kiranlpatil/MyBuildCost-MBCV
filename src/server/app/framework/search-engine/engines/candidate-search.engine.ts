import { SearchEngine } from './search.engine';
import { AppliedFilter } from '../models/input-model/applied-filter';
import { JobDetail } from '../models/output-model/job-detail';
import { ESort } from '../models/input-model/sort-enum';
import { EList } from '../models/input-model/list-enum';
import { CandidateCard } from '../models/output-model/candidate-card';
import CandidateRepository = require('../../dataaccess/repository/candidate.repository');
import {ConstVariables} from "../../shared/sharedconstants";
import {UtilityFunction} from "../../uitility/utility-function";
import {QCard} from "../models/output-model/q-card";
import {obj} from "through2";

export class CandidateSearchEngine extends SearchEngine {
  candidate_q_cards: CandidateCard[] = new Array(0);
  final_candidate_q_cards: CandidateCard[] = new Array(0);
  counter: number = 0;
  candidateRepository: CandidateRepository = new CandidateRepository();

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
    return criteria;
  }

  getSortedCriteria(appliedFilters: AppliedFilter, criteria: any) : Object {
    let sortBy = appliedFilters.sortBy;
    let sortingQuery: any;
    switch (sortBy) {
      case ESort.SALARY:
        sortingQuery = {'professionalDetails.currentSalary' : 1 };
        break;
      case ESort.EXPERIENCE:
        sortingQuery = {'professionalDetails.experience' : -1 };
        break;
      case ESort.BEST_MATCH :
        sortingQuery = {};
        break;
      default:
        sortingQuery = {};
        break;
    }
    return sortingQuery;
  }

  getRequiredFieldNames() {
    let included_fields = {
      '_id': 1,
      'capability_matrix': 1
    };
    return included_fields;
  }

  getMatchingObjects(criteria: any, includedFields: any, sortingQuery: any,
                     callback: (error: any, response: any[]) => void): any {
    if(Object.keys(sortingQuery).length === 0) {
      this.candidateRepository.retrieveResult(criteria, includedFields,(err, items) => {
        callback(err, items);
      });
    } else {
      this.candidateRepository.retrieveSortedResultWithLimit(criteria, includedFields, sortingQuery,(err, items) => {
        callback(err, items);
      });
    }
  }

  buildQCards(objects: any[], jobDetails: JobDetail, appliedFilter: AppliedFilter,
              callback: (error: any, response: any[]) => any): any {
    let sortBy = appliedFilter.sortBy;
    let listName = appliedFilter.listName;
    let mustHaveComplexity = appliedFilter.mustHaveComplexity;

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
      if (mustHaveComplexity && !this.setMustHaveMatrix(jobDetails.capability_matrix,
          obj.capability_matrix, jobDetails.complexity_must_have_matrix)) {
        continue;
      } else {
        candidate_q_card = <CandidateCard> this.computePercentage(obj.capability_matrix,
          jobDetails.capability_matrix, obj._id);
        this.candidate_q_cards.push(candidate_q_card);
      }
    }
    //TODO apply all other sorts here itself Abhi
    if (sortBy === ESort.BEST_MATCH) {
     this.candidate_q_cards = <CandidateCard[]>this.getSortedObjectsByMatchingPercentage(this.candidate_q_cards);
     this.candidate_q_cards.slice(0,ConstVariables.QCARD_LIMIT);
    }
    let ids:any[] = this.candidate_q_cards.map(a => a._id);
    let candidateQuery:any={'_id': {$in: ids.slice(0,ConstVariables.QCARD_LIMIT)}};
    this.candidateRepository.retrieveCandidate(candidateQuery, (err, res) => {
      if(err) {
        callback(err, res);
        return;
      }
      let cards = this.generateQCards(this.candidate_q_cards, res);
      if(listName !== EList.CAN_CART) {
        cards = this.maskQCards(cards);
      }
      callback(err, cards);
      return;
    });
  }

  createQCard(candidate_q_card: CandidateCard, called: string): void {}

  setMustHaveMatrix(jobProfile_capability_matrix: any, candidate_capability_matrix: any, complexity_musthave_matrix: any) {
    let isNotSatisfy: boolean = false;
    for (let cap in jobProfile_capability_matrix) {
      if (candidate_capability_matrix
        && candidate_capability_matrix[cap]
        && complexity_musthave_matrix
        && complexity_musthave_matrix[cap]) {
        if (jobProfile_capability_matrix[cap] !== candidate_capability_matrix[cap] &&
          jobProfile_capability_matrix[cap] !== (Number(candidate_capability_matrix[cap].toString()))) {
          isNotSatisfy = true;
          break;
        }
      }
    }
    return !isNotSatisfy;
  }

  generateQCards(candidateCards:any, candidateDeatails:any): any {
    for(let card of candidateCards) {
      let candidateDetail = candidateDeatails.find((o:any) => o._id == (card._id).toString());
      if(card.exact_matching >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
        let candidate_card = new CandidateCard(
          candidateDetail.userId.first_name, candidateDetail.userId.last_name,
          candidateDetail.professionalDetails.currentSalary, candidateDetail.professionalDetails.experience,
          candidateDetail.userId.picture, card._id, card.above_one_step_matching,
          card.exact_matching, candidateDetail.location.city, candidateDetail.proficiencies);
        this.final_candidate_q_cards.push(candidate_card);
      }
    }
    return this.final_candidate_q_cards;
  }

  maskQCards(q_cards: any []): any[] {
      for(let qCard in q_cards) {
        q_cards[qCard].last_name =  UtilityFunction.valueHide(q_cards[qCard].last_name);
      }
    return q_cards;
  }
}
