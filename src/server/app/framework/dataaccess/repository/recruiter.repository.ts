import RecruiterSchema = require("../schemas/recruiter.schema");
import RepositoryBase = require("./base/repository.base");
import IRecruiter = require("../mongoose/recruiter");
import RecruiterModel = require("../model/recruiter.model");
import {JobQCard} from "../../search/model/job-q-card";
import {ConstVariables} from "../../shared/sharedconstants";
import IndustryModel = require("../model/industry.model");
import CandidateRepository = require("./candidate.repository");
import CandidateModel = require("../model/candidate.model");

class RecruiterRepository extends RepositoryBase<IRecruiter> {
  constructor() {
    super(RecruiterSchema);
  }

  getJobProfileQCard(recruiters: any[], candidate: CandidateModel, jobProfileIds: string[], callback: (error: any, result: any) => void) {  //todo add condition for exit

    let jobs_cards: JobQCard[] = new Array(0);
    for (let recruiter of recruiters) {
      for (let job of recruiter.postedJobs) {
        let isPresent: boolean = false;
        for (let proficiency of candidate.proficiencies) {
          if (job.proficiencies.indexOf(proficiency) != -1) {
            for (let industry of candidate.interestedIndustries) {
              if (job.interestedIndustries.indexOf(industry) != -1) {
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
            for (let list of candidate.job_list) {
              if (list.ids.indexOf(job._id) != -1) {
                isFound = true;
                break;
              }
            }
            if (isFound) {
              continue;
            }
          }
          let candidateRepository: CandidateRepository = new CandidateRepository();
          let candidate_selected_complexity: string[] = new Array(0);
          candidate_selected_complexity = candidateRepository.getCodesFromindustry(candidate.industry);
          let job_selected_complexity: string[] = new Array(0);
          let job_qcard: JobQCard = new JobQCard();
          job_qcard.matching = 0;
          job_selected_complexity = candidateRepository.getCodesFromindustry(job.industry);
          for (let job_item of job_selected_complexity) {
            for (let candi_item of candidate_selected_complexity) {
              if (job_item.substr(0, job_item.lastIndexOf(".")) == candi_item.substr(0, candi_item.lastIndexOf("."))) {
                let job_last_digit: number = Number(job_item.substr(job_item.lastIndexOf(".") + 1));
                let candi_last_digit: number = Number(candi_item.substr(candi_item.lastIndexOf(".") + 1));
                if (job_last_digit == 0) {

                } else if (job_last_digit == candi_last_digit + ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO) {
                  job_qcard.below_one_step_matching += 1;
                } else if (job_last_digit == candi_last_digit - ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO) {
                  job_qcard.above_one_step_matching += 1;
                } else if (job_last_digit == candi_last_digit) {
                  job_qcard.exact_matching += 1;
                }
                break;
              }
            }
          }
          job_qcard.above_one_step_matching = (job_qcard.above_one_step_matching / job_selected_complexity.length) * 100;
          job_qcard.below_one_step_matching = (job_qcard.below_one_step_matching / job_selected_complexity.length) * 100;
          job_qcard.exact_matching = (job_qcard.exact_matching / job_selected_complexity.length) * 100;
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
          job_qcard.industry = job.industry.name;
          job_qcard.jobTitle = job.jobTitle;
          job_qcard.joiningPeriod = job.joiningPeriod;
          if ((job_qcard.above_one_step_matching+job_qcard.exact_matching) >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
            jobs_cards.push(job_qcard);
          }
          //todo add condition for exit
        }
      }
    }
    setTimeout(() => {
      callback(null, jobs_cards);
    }, 4000);
  }


}

Object.seal(RecruiterRepository);
export = RecruiterRepository;
