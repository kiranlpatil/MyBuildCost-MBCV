import {SearchEngine} from "./search.engine";
import {AppliedFilter} from "../models/input-model/applied-filter";
import {CoreMatchingDetail} from "../models/output-model/base-detail";
import {ESort} from "../models/input-model/sort-enum";
import {JobCard} from "../models/output-model/job-card";
import {CandidateDetail} from "../models/output-model/candidate-detail";
import {ConstVariables} from "../../shared/sharedconstants";
import JobProfileRepository = require('../../dataaccess/repository/job-profile.repository');
import CandidateRepository = require("../../dataaccess/repository/candidate.repository");
import { EList } from '../models/input-model/list-enum';
import * as mongoose from 'mongoose';
export class JobSearchEngine extends SearchEngine {
  job_q_cards: JobCard[] = new Array(0);
  final_job_q_cards: JobCard[] = new Array(0);

  jobProfileRepository: JobProfileRepository = new JobProfileRepository();
  candidateRepository: CandidateRepository;

  constructor() {
    super();
    this.candidateRepository = new CandidateRepository();
  }

  buildBusinessCriteria(details: CoreMatchingDetail): any {
    let today = new Date();
    if (details.interestedIndustries === undefined) {
      details.interestedIndustries = [];
      details.interestedIndustries.push('None');
    }
    let criteria: any = {
      $or: [{'industry.name': details.industryName}, {'releventIndustries': {$in: [details.industryName]}}],
      'isJobPosted': true,
      'isJobPostClosed': false,
      'isJobPostExpired': false,
      'expiringDate': {$gte: today},
      'interestedIndustries': {$in: details.interestedIndustries}
    };
    return criteria;
  }

  buildUserCriteria(filter: AppliedFilter, criteria: any): any {
    if (filter.location !== undefined && filter.location !== '') {
      criteria['location.city'] = filter.location;
    }
    if (filter.recruiterId !== undefined && filter.recruiterId !== '') {
      criteria['recruiterId'] = filter.recruiterId;
    }
    if (filter.education && filter.education.length > 0) {
      criteria['education'] = {$in: filter.education};
    }
    if (filter.proficiencies && filter.proficiencies.length > 0) {
      criteria['proficiencies'] = {$in: filter.proficiencies};
    }
    if (filter.interestedIndustries && filter.interestedIndustries.length > 0) {
      criteria['interestedIndustries'] = {$in: filter.interestedIndustries};
    }
    if (filter.joinTime !== undefined && filter.joinTime !== '') {
      criteria['joiningPeriod'] = filter.joinTime;
    }
    if (filter.minSalary && filter.minSalary.toString() !== undefined && filter.minSalary.toString() !== '' && filter.maxSalary &&
      filter.maxSalary.toString() !== undefined && filter.maxSalary.toString() !== '') {
      criteria['salaryMaxValue'] = {
        $lte: Number(filter.maxSalary)
      };
    }if (filter.minExperience && filter.minExperience.toString() !== undefined && filter.minExperience.toString() !== '' && filter.maxExperience &&
      filter.maxExperience.toString() !== undefined && filter.maxExperience.toString() !== '') {
      criteria['experienceMinValue'] = {
        $gte: Number(filter.minExperience),
      };
    }
    return criteria;
  }

  getSortedCriteria(appliedFilters: AppliedFilter, criteria: any): Object {
    let sortBy = appliedFilters.sortBy;
    let sortingQuery: any;
    switch (sortBy) {
      case ESort.SALARY:
        sortingQuery = {'salaryMaxValue': -1};
        break;
      case ESort.EXPERIENCE:
        sortingQuery = {'experienceMinValue': 1};
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

  getRequiredFieldNames(filter:AppliedFilter) {
    let included_fields = {
      '_id': 1,
      'capability_matrix': 1,
      'complexity_musthave_matrix': 1
    };
    return included_fields;
  }

  getMatchingObjects(criteria: any, includedFields: any, sortingQuery: any,
                     callback: (error: any, response: any[]) => void): void {
    if (Object.keys(sortingQuery).length === 0) {
      this.jobProfileRepository.retrieveResult(criteria, includedFields, (err, items) => {
        callback(err, items);
      });
    } else {
      this.jobProfileRepository.retrieveSortedResult(criteria, includedFields, sortingQuery, (err, items) => {
        callback(err, items);
      });
    }
  }

  buildQCards(jobs: any[], candidateDetails: CandidateDetail, appliedFilter: AppliedFilter,
              callback: (error: any, response: any[]) => any): any {
    let sortBy = appliedFilter.sortBy;
    let listName = appliedFilter.listName;
    let jobProfileQuery:any;
    for (let job of jobs) {
      let isFound: boolean = false;
      if (listName === EList.JOB_MATCHED && !appliedFilter.isCandidateSearch) {
        if (candidateDetails.job_list) {
          for (let list of candidateDetails.job_list) {
            if (list.ids.indexOf(job._id.toString()) !== -1) {
              isFound = true;
              break;
            }
          }
        }
        if (isFound) {
          continue;
        }
      }
      let job_q_card: JobCard;
      job_q_card = <JobCard> this.computePercentage(candidateDetails.capability_matrix,job.capability_matrix,
         job._id);
      this.job_q_cards.push(job_q_card);
    }

    if (sortBy === ESort.BEST_MATCH) {
      this.job_q_cards = <JobCard[]>this.getSortedObjectsByMatchingPercentage(this.job_q_cards);
      this.job_q_cards = this.job_q_cards.slice(0,ConstVariables.QCARD_LIMIT);
      let ids: any[] = this.job_q_cards.map(a => a._id);
      jobProfileQuery = {'_id': {$in: ids.slice(0, ConstVariables.QCARD_LIMIT)}};
    }else {
      let ids: any[] = this.job_q_cards.map(a => a._id);
      jobProfileQuery = {'_id': {$in: ids}};
    }
    this.jobProfileRepository.retrieveJobProfiles(jobProfileQuery, (err, res) => {
      if (err) {
        callback(err, res);
        return;
      }
      let cards = this.generateQCards(this.job_q_cards, res,sortBy);
      callback(err, cards);
      return;
    });
  }

  generateQCards(jobCards: any, jobDetails: any,sortBy:any): any {
    for (let card of jobCards) {
      let jobDetail = jobDetails.find((o: any) => o._id == (card._id).toString());
      if (card.exact_matching >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
        let jobCard = new JobCard(
          jobDetail.recruiterId.company_name, jobDetail.salaryMinValue, jobDetail.salaryMaxValue, jobDetail.experienceMinValue,
          jobDetail.experienceMaxValue, jobDetail.education, jobDetail.recruiterId.company_size, jobDetail.recruiterId.company_logo,
          jobDetail.postingDate, jobDetail.industry.name, jobDetail.jobTitle, jobDetail.hideCompanyName, jobDetail.candidate_list,
          jobDetail.isJobPostClosed, jobDetail._id, card.above_one_step_matching, card.exact_matching,
          jobDetail.location.city, jobDetail.proficiencies);
        this.final_job_q_cards.push(jobCard);
        if(sortBy !== ESort.BEST_MATCH && this.final_job_q_cards.length === ConstVariables.QCARD_LIMIT) {
          break;
        }
    }
  }
  return this.final_job_q_cards;
  }

  getCoreMatchAgainstDetails(canId: string, callback: (err: Error, res: CandidateDetail) => void): any {
    this.candidateRepository.findById(canId, (myError: Error, response: any) => {
      if (myError) {
        callback(myError, null);
        return;
      }
      let canDetail = new CandidateDetail();
      canDetail.industryName = response.industry.name;
      canDetail.capability_matrix = response.capability_matrix;
      canDetail.job_list = response.job_list;
      canDetail.userId = response.userId;
      callback(null, canDetail);
    });
  }

  lookupInIds(candidateDetails: CandidateDetail, listName : EList) : mongoose.Types.ObjectId [] {
    let list : string;
    switch (listName) {
      case EList.JOB_APPLIED :
        list = ConstVariables.APPLIED_CANDIDATE;
        break;
      case EList.JOB_NOT_INTERESTED :
        list = ConstVariables.BLOCKED_CANDIDATE;
        break;
    }
    let send_ids : mongoose.Types.ObjectId[];
    send_ids  = new Array(0);
    for(let obj of candidateDetails.job_list) {
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
