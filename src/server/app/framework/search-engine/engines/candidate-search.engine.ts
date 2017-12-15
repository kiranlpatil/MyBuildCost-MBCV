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
import RecruiterRepository = require("../../dataaccess/repository/recruiter.repository");
import JobProfileRepository = require("../../dataaccess/repository/job-profile.repository");
import {CoreMatchingDetail} from "../models/output-model/base-detail";
import * as mongoose from 'mongoose';
export class CandidateSearchEngine extends SearchEngine {
  candidate_q_cards: CandidateCard[] = new Array(0);
  final_candidate_q_cards: CandidateCard[] = new Array(0);
  counter: number = 0;
  candidateRepository: CandidateRepository = new CandidateRepository();
  recruiterRepository : RecruiterRepository;
  jobProfileRepository : JobProfileRepository;
  constructor() {
    super();
    this.recruiterRepository= new RecruiterRepository();
    this.jobProfileRepository= new JobProfileRepository();
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
    if (filter.academics && filter.academics.length > 0) {
      criteria['academics'] = {$elemMatch: {educationDegree: filter.academics}};
    }
    if (filter.specialization && filter.specialization.length > 0) {
      criteria['academics'] = {$elemMatch: {specialization: filter.specialization}};
      if (filter.academics && filter.academics.length > 0) {
        criteria['academics'] = {$elemMatch: {educationDegree: filter.academics,specialization: filter.specialization}};
      }
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

  getRequiredFieldNames(appliedFilters: AppliedFilter) {
    let included_fields: any;
    if(appliedFilters.isMasterData) {
      included_fields = {
        'academics': 1,
        'proficiencies': 1
      };
    } else {
      included_fields = {
        '_id': 1,
        'capability_matrix': 1
      };
    }
    return included_fields;
  }

  getMatchingObjects(criteria: any, includedFields: any, sortingQuery: any,
                     callback: (error: any, response: any[]) => void): any {
    if(Object.keys(sortingQuery).length === 0) {
      this.candidateRepository.retrieveResult(criteria, includedFields,(err, items) => {
        callback(err, items);
      });
    } else {
      this.candidateRepository.retrieveSortedResult(criteria, includedFields, sortingQuery,(err, items) => {
        callback(err, items);
      });
    }
  }

  buildQCards(objects: any[], jobDetails: JobDetail, appliedFilter: AppliedFilter,
              callback: (error: any, response: any[]) => any): any {
    let sortBy = appliedFilter.sortBy;
    let listName = appliedFilter.listName;
    let mustHaveComplexity = appliedFilter.mustHaveComplexity;
    let candidateQuery:any;
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
     this.candidate_q_cards = this.candidate_q_cards.slice(0,ConstVariables.QCARD_LIMIT);
      let ids : any[] = this.candidate_q_cards.map(a => a._id);
      candidateQuery= {'_id': {$in: ids.slice(0,ConstVariables.QCARD_LIMIT)}};
    }else {
      let ids: any[] = this.candidate_q_cards.map(a => a._id);
      candidateQuery = {'_id': {$in: ids}};
    }
    this.candidateRepository.retrieveCandidate(candidateQuery, (err, res) => {
      if(err) {
        callback(err, res);
        return;
      }
      let cards = this.generateQCards(this.candidate_q_cards, res,sortBy);
      if(listName !== EList.CAN_CART) {
        cards = this.maskQCards(cards);
      }
      callback(err, cards);
      return;
    });
  }

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

  generateQCards(candidateCards:any, candidateDetails:any,sortBy:any): any {
    for(let card of candidateCards) {
      let candidateDetail = candidateDetails.find((o:any) => o._id == (card._id).toString());
      if(card.exact_matching >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
        let candidateCard = new CandidateCard(
          candidateDetail.userId.first_name, candidateDetail.userId.last_name,
          candidateDetail.professionalDetails.currentSalary, candidateDetail.professionalDetails.experience,
          candidateDetail.userId.picture, card._id, card.above_one_step_matching,
          card.exact_matching, candidateDetail.location.city, candidateDetail.proficiencies);
        this.final_candidate_q_cards.push(candidateCard);
        if(sortBy !== ESort.BEST_MATCH && this.final_candidate_q_cards.length === ConstVariables.QCARD_LIMIT) {
          break;
        }
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

  getCoreMatchAgainstDetails(jobId: string, callback : (err : Error, res : CoreMatchingDetail)=> void) : void {

    this.jobProfileRepository.findById(jobId, (myError: Error, response : any) => {
      if(myError) {
        callback(myError, null);
        return ;
      }
      let jobDetail = new JobDetail();
      jobDetail.interestedIndustries= response.interestedIndustries;
      jobDetail.industryName = response.industry.name;
      jobDetail.relevantIndustries = response.releventIndustries;
      jobDetail.city = response.location.city;
      jobDetail.candidateList = response.candidate_list;
      jobDetail.capability_matrix = response.capability_matrix;
      jobDetail.complexity_must_have_matrix = response.complexity_musthave_matrix;
      callback(null,jobDetail);
    });
  }

  lookupInIds(jobDetail : JobDetail, listName : EList) : mongoose.Types.ObjectId [] {
    let list : string;
    switch (listName) {
      case EList.CAN_APPLIED :
        list =ConstVariables.APPLIED_CANDIDATE;
        break;
      case EList.CAN_CART :
        list =ConstVariables.CART_LISTED_CANDIDATE;
        break;
      case EList.CAN_REJECTED :
        list =ConstVariables.REJECTED_LISTED_CANDIDATE;
        break;
    }
    let send_ids : mongoose.Types.ObjectId[];
    send_ids  = new Array(0);
    for(let obj of jobDetail.candidateList) {
      if (list === obj.name) {
        for(let id of obj.ids) {
          send_ids.push(mongoose.Types.ObjectId(id));
        }
        break;
      }
    }
    return send_ids;
  }
}
