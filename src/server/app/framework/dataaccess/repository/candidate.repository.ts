import CandidateSchema = require("../schemas/candidate.schema");
import RepositoryBase = require("./base/repository.base");
import ICandidate = require("../mongoose/candidate");
import * as mongoose from "mongoose";
import JobProfileModel = require("../model/jobprofile.model");
import CandidateModel = require("../model/candidate.model");
import IndustryModel = require("../model/industry.model");
import CandidateCardViewModel = require("../model/candidate-card-view.model");
import {CandidateQCard} from "../../search/model/candidate-q-card";


class CandidateRepository extends RepositoryBase<ICandidate> {

  constructor() {
    super(CandidateSchema);
  }


  getCandidateQCard(candidates:CandidateModel[], jobProfile:JobProfileModel, callback:(err : any, res:any)=> void) {
    let job_posted_selected_complexity:string[] = new Array(0);
    job_posted_selected_complexity = this.getCodesFromindustry(jobProfile.industry);
    let card_view_candidates:CandidateQCard[] = new Array(0);
    for (let candidate of candidates) {
      let candidate_selected_complexity:string[] = new Array(0);
      let candidate_card_view:CandidateQCard = new CandidateQCard();
      candidate_card_view.matching = 0;
      candidate_selected_complexity = this.getCodesFromindustry(candidate.industry);
      for (let job_item of job_posted_selected_complexity) {
        for (let candi_item of candidate_selected_complexity) {
          if (job_item.substr(0,job_item.lastIndexOf("."))== candi_item.substr(0,candi_item.lastIndexOf("."))) {
            let job_last_digit: number = Number(job_item.substr(job_item.lastIndexOf(".")+1));
            let candi_last_digit: number = Number(candi_item.substr(candi_item.lastIndexOf(".")+1));
            if(candi_last_digit == job_last_digit - 1){
                candidate_card_view.below_one_step_matching +=10;
                candidate_card_view.matching+=10;
            }else if(candi_last_digit == job_last_digit + 1) {
              candidate_card_view.above_one_step_matching +=10;
              candidate_card_view.matching+=10;
            }else if(candi_last_digit == job_last_digit ){
              candidate_card_view.matching+=10;
              candidate_card_view.exact_matching +=10;
            }
            break;
          }
        }
      }
      candidate_card_view.salary = candidate.professionalDetails.currentSalary;
      candidate_card_view.experience = candidate.professionalDetails.experience;
      candidate_card_view.location = candidate.professionalDetails.relocate;
      card_view_candidates.push(candidate_card_view);
      if (card_view_candidates.length == candidates.length) {
        callback(null, card_view_candidates);
      }
    }

  }

  getCodesFromindustry(industry:IndustryModel):string[] {

    let selected_complexity:string[] = new Array(0);
    for (let role of industry.roles) {
      for (let capability of role.capabilities) {
        for (let complexity of capability.complexities) {
          for (let scenario of complexity.scenarios) {
            if (scenario.isChecked) {
              if (scenario.code) {
                selected_complexity.push(scenario.code);
              }
            }
          }
        }
      }
    }
    return selected_complexity;
  }


}

Object
  .seal(CandidateRepository);

export = CandidateRepository;
