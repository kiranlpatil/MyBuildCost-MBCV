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
  job_q_cards: JobCard[] = new Array(0);
  final_job_q_cards: JobCard[] = new Array(0);

  jobProfileRepository: JobProfileRepository = new JobProfileRepository();


  buildBusinessCriteria(details: BaseDetail): any {
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
    }
    if (filter.minExperience && filter.minExperience.toString() !== undefined && filter.minExperience.toString() !== '' && filter.maxExperience &&
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

  getRequiredFieldNames() {
    let included_fields = {
      '_id': 1,
      'capability_matrix': 1,
      'complexity_musthave_matrix': 1
    };
    return included_fields;
  }

  getMatchingObjects(criteria: any, includedFields: any, sortingQuery: any,
                     callback: (error: any, response: any[]) => void): void {
    if(Object.keys(sortingQuery).length === 0) {
      this.jobProfileRepository.retrieveResult(criteria, includedFields,(err, items) => {
        callback(err, items);
      });
    } else {
      this.jobProfileRepository.retrieveSortedResultWithLimit(criteria, includedFields, sortingQuery,(err, items) => {
        callback(err, items);
      });
    }
  }

  buildQCards(jobs: any[], candidateDetails: CandidateDetail,  appliedFilter: AppliedFilter,
              callback: (error: any, response: any[]) => any): any {
    let sortBy = appliedFilter.sortBy;
    let listName = appliedFilter.listName;

    for (let job of jobs) {
      let job_q_card: JobCard;
      job_q_card = <JobCard> this.computePercentage(job.capability_matrix,
        candidateDetails.capability_matrix, job._id);
      this.job_q_cards.push(job_q_card);

      //if (job_q_card.exact_matching >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
        /*if (sortBy !== ESort.BEST_MATCH) {
          if (this.job_q_cards.length < 100) {
            this.createQCard(job_q_card, job);
          } else {
            break;
          }
        } else {
          this.createQCard(job_q_card, job);
        }*/
    }

    if (sortBy === ESort.BEST_MATCH) {
      this.job_q_cards = <JobCard[]>this.getSortedObjectsByMatchingPercentage(this.job_q_cards);
    }

    let ids:any[] = this.job_q_cards.map(a => a._id);
    let jobProfileQuery:any={'_id': {$in: ids.slice(0, 101)}};
    this.jobProfileRepository.retrieveJobProfiles(jobProfileQuery, (err, res) => {
      if(err) {
        callback(err, res);
        return;
      }
      let cards = this.generateQCards(this.job_q_cards, res);
      callback(err, cards);
      return;
    });
  }

  createQCard(job_q_card: JobCard, job: any): any {
    let job_card = new JobCard('Test', job.salaryMinValue, job.salaryMaxValue, job.experienceMinValue,
      job.experienceMaxValue, job.education, 'No', 'No', job.postingDate, job.industry.name, job.jobTitle,
      job.hideCompanyName, job.candidate_list, job.isJobPostClosed, job._id, job_q_card.above_one_step_matching, job_q_card.exact_matching,
      job.location.city, job.proficiencies);
    this.job_q_cards.push(job_card);
  }

  generateQCards(jobCards:any, deatailedcards:any): any{
    let count = 0;
    for(let card of deatailedcards) {
      count++;
      let job_card = jobCards.find((o:any) => o._id == (card._id).toString());
      if(job_card.exact_matching >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {

        let jobProfile_card = new JobCard(
          card.recruiterId.company_name, card.salaryMinValue, card.salaryMaxValue, card.experienceMinValue,
          card.experienceMaxValue, card.education, card.recruiterId.company_size, card.recruiterId.company_logo,
          card.postingDate, card.industry.name, card.jobTitle, card.hideCompanyName, card.candidate_list,
          card.isJobPostClosed, card._id, job_card.above_one_step_matching, job_card.exact_matching,
          card.location.city, card.proficiencies);
        this.final_job_q_cards.push(jobProfile_card);

        if(deatailedcards.length == count) {
          console.log('from return2');
          return this.final_job_q_cards;
        }
      }
      else {
        continue;
      }
    }
  }
}
