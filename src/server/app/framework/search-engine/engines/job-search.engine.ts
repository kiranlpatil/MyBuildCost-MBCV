import {SearchEngine} from "./search.engine";
import {AppliedFilter} from "../models/input-model/applied-filter";
import {BaseDetail} from "../models/output-model/base-detail";
import {ESort} from "../models/input-model/sort-enum";
import {EList} from "../models/input-model/list-enum";
import {JobCard} from "../models/output-model/job-card";
import {CandidateDetail} from "../models/output-model/candidate-detail";
import {ConstVariables} from "../../shared/sharedconstants";
import JobProfileRepository = require('../../dataaccess/repository/job-profile.repository');
export class JobSearchEngine extends SearchEngine {
  job_q_cards : JobCard[] = new Array(0);

  buildBusinessCriteria(details : BaseDetail): any {
    let today = new Date();
    if (details.interestedIndustries === undefined) {
      details.interestedIndustries = [];
      details.interestedIndustries.push('None');
    }
    let criteria: any = {
      $or:[ {'industry.name': details.industryName},{'releventIndustries': { $in : [details.industryName] }}],
      'isJobPosted' : true,
      'isJobPostClosed': false,
      'isJobPostExpired' : false,
      'expiringDate': {$gte: today},
      'interestedIndustries': {$in: details.interestedIndustries}
    };
    return criteria;
  }

  buildUserCriteria(filter : AppliedFilter, criteria : any) : any {
    if (filter.location !== undefined && filter.location !== '') {
      criteria['location.city'] =  filter.location;
    }
    if (filter.recruiterId !== undefined && filter.recruiterId !== '') {
      criteria['recruiterId'] =  filter.recruiterId;
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
    }
    if (filter.minExperience && filter.minExperience.toString() !== undefined && filter.minExperience.toString() !== '' && filter.maxExperience &&
      filter.maxExperience.toString() !== undefined && filter.maxExperience.toString() !== '') {
      criteria['experienceMinValue'] = {
        $gte: Number(filter.minExperience),
      };
    }
    return criteria;
  }

  getSortedCriteria(appliedFilters: AppliedFilter, criteria: any) : Object {
    let sortBy = appliedFilters.sortBy;
    let sortingQuery: any;
    switch (sortBy) {
      case ESort.SALARY:
        sortingQuery = {'salaryMaxValue' : -1 };
        break;
      case ESort.EXPERIENCE:
        sortingQuery = {'experienceMinValue' : 1 };
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

  getMatchingObjects(criteria : any, sortingQuery: any, callback : (error : any, response : any[]) => void) : void {
    let jobProfileRepository : JobProfileRepository = new JobProfileRepository();
    jobProfileRepository.retrieveBySortedOrderAndLimit(criteria, sortingQuery,(err : Error, res: any[]) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, res);
        }
      });
  }

  buildQCards(jobs : any[], candidateDetails : CandidateDetail, sortBy : ESort, listName: EList) : any {
    for(let job of jobs) {
      let job_q_card : JobCard;
      job_q_card = <JobCard> this.computePercentage(job.capability_matrix, candidateDetails.capability_matrix);
      if(job_q_card.exact_matching >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
        if (sortBy !== ESort.BEST_MATCH) {
          if (this.job_q_cards.length < 100) {
            this.createQCard(job_q_card, job);
          } else {
            break;
          }
        } else {
          this.createQCard(job_q_card, job);
        }
      }
    }
    if (sortBy === ESort.BEST_MATCH) {
      this.job_q_cards = <JobCard[]>this.getSortedObjectsByMatchingPercentage(this.job_q_cards);
    }
    return this.job_q_cards.slice(0,100);
  }

  createQCard(job_q_card : JobCard, job : any): any {
    let job_card = new JobCard('Test',job.salaryMinValue,job.salaryMaxValue,job.experienceMinValue,
    job.experienceMaxValue,job.education,'No','No',job.postingDate,job.industry.name,job.jobTitle,
    job.hideCompanyName,job.candidate_list,job.isJobPostClosed,job._id,job_q_card.above_one_step_matching,job_q_card.exact_matching,
    job.location.city,job.proficiencies);
    this.job_q_cards.push(job_card);
  }

}
