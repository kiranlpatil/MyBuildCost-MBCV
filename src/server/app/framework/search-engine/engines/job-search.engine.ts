import { SearchEngine } from './search.engine';
import { AppliedFilter } from '../models/input-model/applied-filter';
import { BaseDetail } from '../models/output-model/base-detail';
import { EList } from '../models/input-model/list-enum';
import { ESort } from '../models/input-model/sort-enum';
import RecruiterRepository = require('../../dataaccess/repository/recruiter.repository');
import { JobCard } from '../models/output-model/job-card';
import RecruiterClassModel = require('../../dataaccess/model/recruiterClass.model');
import { CandidateDetail } from '../models/output-model/candidate-detail';
import JobProfileModel = require('../../dataaccess/model/jobprofile.model');
export class JobSearchEngine extends SearchEngine {
  job_q_cards : JobCard[] = new Array(0);
  buildBusinessCriteria(details : BaseDetail): any {
    let criteria = {
     // 'postedJobs.industry.name': details.industryName,
      //'postedJobs.expiringDate': {$gte: currentDate}
    };
    return criteria;
  }

  buildUserCriteria(filter : AppliedFilter, criteria : any) : any {
   /* if (filter.location !== undefined && filter.location !== '') {
      criteria.$or = [{'postedJobs.location.city': filter.location}];
    }
    if (filter.education && filter.education.length > 0) {
      criteria['postedJobs.education'] = {$in: filter.education};
    }
    if (filter.proficiencies && filter.proficiencies.length > 0) {
      criteria['postedJobs.proficiencies'] = {$in: filter.proficiencies};
    }
    if (filter.interestedIndustries && filter.interestedIndustries.length > 0) {
      criteria['postedJobs.interestedIndustries'] = {$in: filter.interestedIndustries};
    }
    if (filter.joinTime !== undefined && filter.joinTime !== '') {
      criteria['postedJobs.joiningPeriod'] = filter.joinTime;
    }
/!*
    if (filter.minSalary !== undefined && filter.minSalary !== '' &&
      filter.maxSalary !== undefined && filter.maxSalary !== '') {
      criteria['postedJobs.currentSalary'] = {
        $gte: Number(filter.minSalary),
        $lte: Number(filter.maxSalary)
      };
    }
    if (filter.minExperience !== undefined && filter.minExperience !== '' &&
      filter.maxExperience !== undefined && filter.maxExperience !== '') {
      criteria['postedJobs.experienceMinValue'] = {
        $gte: Number(filter.minExperience),
        $lte: Number(filter.maxExperience)
      };
    }
*!/*/
    return criteria;
  }

  getMatchingObjects(criteria : any, callback : (error : any, response : any) => void) : void {
      let recruiterRepository : RecruiterRepository = new RecruiterRepository();
      recruiterRepository.retrieveWithLean(criteria, {}, (err, res) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, res);
        }
      });
  }

  buildQCards(jobs : any[], candidateDetails : CandidateDetail, sortBy : ESort) : any {
    for(let job of jobs) {
      let job_q_card : JobCard;
      job_q_card = <JobCard> this.computePercentage(job.capability_matrix, candidateDetails.capability_matrix);
      if(sortBy !== ESort.BEST_MATCH) {
        if(this.job_q_cards.length < 100) {
          this.createQCard(job_q_card,job);
        }else {
          break;
        }
      }else {
        this.createQCard(job_q_card,job);
      }
    }
    switch (sortBy) {

      case ESort.EXPERIENCE :
        this.job_q_cards.sort((first: JobCard, second : JobCard):number=> {
          if(first.experienceMinValue >second.experienceMinValue ) {
            return -1;
          }
          if(first.experienceMinValue < second.experienceMinValue ) {
            return 1;
          }
          return 0;
        });
        break;
      case ESort.SALARY :
        this.job_q_cards.sort((first: JobCard, second : JobCard):number=> {
          if(first.salaryMaxValue >second.salaryMaxValue ) {
            return -1;
          }
          if(first.salaryMaxValue < second.salaryMaxValue ) {
            return 1;
          }
          return 0;
        });
        break;
      case ESort.BEST_MATCH :
        this.job_q_cards.sort((first: JobCard, second : JobCard):number=> {
          if((first.above_one_step_matching+first.exact_matching) >(second.above_one_step_matching+second.exact_matching) ) {
            return -1;
          }
          if((first.above_one_step_matching+first.exact_matching) < (second.above_one_step_matching+second.exact_matching) ) {
            return 1;
          }
          return 0;
        });
        break;

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
