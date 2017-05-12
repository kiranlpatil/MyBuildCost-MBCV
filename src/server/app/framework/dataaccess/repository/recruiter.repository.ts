import RecruiterSchema = require("../schemas/recruiter.schema");
import RepositoryBase = require("./base/repository.base");
import IRecruiter = require("../mongoose/recruiter");
import RecruiterModel = require("../model/recruiter.model");
import {JobQCard} from "../../search/model/job-q-card";
import IndustryModel = require("../model/industry.model");
import CandidateRepository = require("./candidate.repository");
import CandidateModel = require("../model/candidate.model");

class RecruiterRepository extends RepositoryBase<IRecruiter> {
  constructor() {
    super(RecruiterSchema);
  }

  getJobProfileQCard(recruiters:RecruiterModel[], candidate:CandidateModel, callback:(error:any, result:any) => void) {


    let jobs_cards:JobQCard[] = new Array(0);
    for (let recruiter of recruiters) {
      for (let job of recruiter.postedJobs) {
        let isPresent:boolean = false;
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
          let candidateRepository:CandidateRepository = new CandidateRepository();
          let candidate_selected_complexity:string[] = new Array(0);
          candidate_selected_complexity = candidateRepository.getCodesFromindustry(candidate.industry);
            let job_selected_complexity:string[] = new Array(0);
              let job_qcard:JobQCard = new JobQCard();
              job_qcard.matching = 0;
              job_selected_complexity = candidateRepository.getCodesFromindustry(job.industry);
              for (let job_item of job_selected_complexity) {
                for (let candi_item of candidate_selected_complexity) {
                  if (job_item.substr(0, job_item.lastIndexOf(".")) == candi_item.substr(0, candi_item.lastIndexOf("."))) {
                    let job_last_digit:number = Number(job_item.substr(job_item.lastIndexOf(".") + 1));
                    let candi_last_digit:number = Number(candi_item.substr(candi_item.lastIndexOf(".") + 1));
                    if (candi_last_digit == job_last_digit - 1) {
                      job_qcard.below_one_step_matching += 10;
                    } else if (candi_last_digit == job_last_digit + 1) {
                      job_qcard.above_one_step_matching += 10;
                    } else if (candi_last_digit == job_last_digit) {
                      job_qcard.exact_matching += 10;
                    }
                    break;
                  }
                }
              }
              job_qcard.matching = job_qcard.above_one_step_matching + job_qcard.below_one_step_matching + job_qcard.exact_matching;
              job_qcard.company_name = recruiter.company_name;
              job_qcard.company_size = recruiter.company_size;
              job_qcard.salary = job.salary;
              job_qcard.experience = job.experience;
              job_qcard.education = job.education;
              job_qcard.interestedIndustries = job.interestedIndustries;
              jobs_cards.push(job_qcard);
              //todo add condition for exit
              /*if(jobs_cards.length==recruiters.length){

               }*/
          }

      }
    }
    setTimeout(()=> {
      callback(null, jobs_cards);
    }, 2000);
  }


}

Object.seal(RecruiterRepository);
export = RecruiterRepository;
