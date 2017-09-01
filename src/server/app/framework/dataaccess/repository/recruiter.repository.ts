import RecruiterSchema = require('../schemas/recruiter.schema');
import RepositoryBase = require('./base/repository.base');
import IRecruiter = require('../mongoose/recruiter');
import {JobQCard} from "../../search/model/job-q-card";
import {ConstVariables} from "../../shared/sharedconstants";
import CandidateModel = require('../model/candidate.model');

class RecruiterRepository extends RepositoryBase<IRecruiter> {
  constructor() {
    super(RecruiterSchema);
  }

  getJobProfileQCard(recruiters:any[], candidate:CandidateModel, jobProfileIds:string[], isSearchView:string, callback:(error:any, result:any) => void) {
    let isSend : boolean = false;
    let jobs_cards: JobQCard[] = new Array(0);
    if(recruiters.length === 0) {
      callback(null, jobs_cards);
    }
    for (let recruiter of recruiters) {
      for (let job of recruiter.postedJobs) {
        if(!job.isJobPosted) {
          continue;
        }
        let isPresent: boolean = false;
        for (let proficiency of candidate.proficiencies) {
          if (job.proficiencies.indexOf(proficiency) !== -1) {
            if(job.interestedIndustries.indexOf('None') !== -1) {
              isPresent = true;
              break;
            }
            for (let industry of candidate.interestedIndustries) {
              if (job.interestedIndustries.indexOf(industry) !== -1) {
                isPresent = true;
              }
            }
          }
        }
        if (isPresent) {
          if (jobProfileIds) {
            if (jobProfileIds.indexOf(job._id) == -1) {
              continue;
            }
          } else {
            let isFound: boolean = false;
            if (isSearchView !== 'searchView') {
              for (let list of candidate.job_list) {
                if (list.ids.indexOf(job._id) != -1) {
                  isFound = true;
                  break;
                }
              }
            }
            if (isFound) {
              continue;
            }
          }
          let job_qcard: JobQCard = new JobQCard();
          job_qcard.matching = 0;
          let count : number = 0;
          for (let cap in job.capability_matrix) {
            if (job.capability_matrix[cap] == -1 || job.capability_matrix[cap] == 0 || job.capability_matrix[cap] == undefined) {
            } else if (job.capability_matrix[cap] == candidate.capability_matrix[cap]) {
              job_qcard.exact_matching += 1;
              count++;
            } else if (job.capability_matrix[cap] == (Number(candidate.capability_matrix[cap]) - ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
              job_qcard.above_one_step_matching += 1;
              count++;
            } else if (job.capability_matrix[cap] == (Number(candidate.capability_matrix[cap]) + ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
              job_qcard.below_one_step_matching += 1;
              count++;
            } else {
              count++;
            }
          }

          job_qcard.above_one_step_matching = (job_qcard.above_one_step_matching / count) * 100;
          job_qcard.below_one_step_matching = (job_qcard.below_one_step_matching / count) * 100;
          job_qcard.exact_matching = (job_qcard.exact_matching / count) * 100;
          job_qcard.matching = job_qcard.above_one_step_matching + job_qcard.below_one_step_matching + job_qcard.exact_matching;
          job_qcard.company_name = recruiter.company_name;
          job_qcard.company_size = recruiter.company_size;
          job_qcard.company_logo = recruiter.company_logo;
          job_qcard.salaryMinValue = job.salaryMinValue;
          job_qcard.salaryMaxValue = job.salaryMaxValue;
          job_qcard.experienceMinValue = job.experienceMinValue;
          job_qcard.experienceMaxValue = job.experienceMaxValue;
          job_qcard.education = job.education;
          job_qcard.interestedIndustries = job.interestedIndustries;
          job_qcard.proficiencies = job.proficiencies;
          job_qcard.location = job.location.city;
          job_qcard._id = job._id;
          job_qcard.industry = job.industry.name; //todo add industry name
          job_qcard.jobTitle = job.jobTitle;
          job_qcard.joiningPeriod = job.joiningPeriod;
          job_qcard.postingDate = job.postingDate;
          job_qcard.hideCompanyName = job.hideCompanyName;
          job_qcard.candidate_list = job.candidate_list;
          if ((job_qcard.above_one_step_matching + job_qcard.exact_matching) >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
            jobs_cards.push(job_qcard);
          }
        }
      }
      if(recruiters.indexOf(recruiter) == recruiters.length - 1) {
          isSend= true;
          callback(null, jobs_cards);
        }
    }

  }


}

Object.seal(RecruiterRepository);
export = RecruiterRepository;
