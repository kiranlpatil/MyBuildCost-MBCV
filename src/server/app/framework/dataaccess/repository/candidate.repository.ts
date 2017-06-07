import CandidateSchema = require("../schemas/candidate.schema");
import RepositoryBase = require("./base/repository.base");
import ICandidate = require("../mongoose/candidate");
import * as mongoose from "mongoose";
import JobProfileModel = require("../model/jobprofile.model");
import CandidateModel = require("../model/candidate.model");
import IndustryModel = require("../model/industry.model");
import CandidateCardViewModel = require("../model/candidate-card-view.model");
import {CandidateQCard} from "../../search/model/candidate-q-card";
import UserRepository = require("./user.repository");
import UserModel = require("../model/user.model");
import {ConstVariables} from "../../shared/sharedconstants";


class CandidateRepository extends RepositoryBase<ICandidate> {

  constructor() {
    super(CandidateSchema);
  }


  getCandidateQCard(candidates:any[], jobProfile:JobProfileModel,candidatesIds: string[], callback:(err:any, res:any)=> void) {
    let job_posted_selected_complexity:string[] = new Array(0);
    job_posted_selected_complexity = this.getCodesFromindustry(jobProfile.industry);
    let card_view_candidates:CandidateQCard[] = new Array(0);
    let count=0;
    let count_for_break =0;
    let isSend : boolean=false;
    for (let candidate of candidates) {
      let isFound : boolean= false;
      if(candidatesIds) {
        if (candidatesIds.indexOf(candidate._id.toString()) === -1) {
          continue;
        }
      }else{
        if(jobProfile.candidate_list){
          for(let list of jobProfile.candidate_list){
            if(list.name == ConstVariables.SHORT_LISTED_CANDIDATE){
              continue;
            }
            if(list.ids.indexOf(candidate._id.toString())!=-1){
              isFound=true;
              break;
            }
          }
        }
        if(isFound){
          continue;
        }
      }
      let candidate_selected_complexity:string[] = new Array(0);
      let candidate_card_view:CandidateQCard = new CandidateQCard();
      candidate_card_view.matching = 0;
      candidate_selected_complexity = this.getCodesFromindustry(candidate.industry);
      for (let job_item of job_posted_selected_complexity) {
        for (let candi_item of candidate_selected_complexity) {
          if (job_item.substr(0, job_item.lastIndexOf(".")) == candi_item.substr(0, candi_item.lastIndexOf("."))) {
            let job_last_digit:number = Number(job_item.substr(job_item.lastIndexOf(".") + 1));
            let candi_last_digit:number = Number(candi_item.substr(candi_item.lastIndexOf(".") + 1));
            if (candi_last_digit == job_last_digit - ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO) {
              candidate_card_view.below_one_step_matching += 1;
            } else if (candi_last_digit == job_last_digit + ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO) {
              candidate_card_view.above_one_step_matching += 1;
            } else if (candi_last_digit == job_last_digit) {
              candidate_card_view.exact_matching += 1;
            }
            break;
          }
        }
      }
      candidate_card_view.above_one_step_matching = (candidate_card_view.above_one_step_matching / job_posted_selected_complexity.length) * 100;
      candidate_card_view.below_one_step_matching= (candidate_card_view.below_one_step_matching/ job_posted_selected_complexity.length) * 100;
      candidate_card_view.exact_matching = (candidate_card_view.exact_matching / job_posted_selected_complexity.length) * 100;
      candidate_card_view.matching = candidate_card_view.above_one_step_matching + candidate_card_view.below_one_step_matching + candidate_card_view.exact_matching;
      if(candidate_card_view.matching >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT){
          count++;
      }
      let userRepository:UserRepository = new UserRepository();
      userRepository.findById(candidate.userId.toString(), (error:any, res:UserModel)=> {
        if (error) {
          callback(error, null);
        } else {
          candidate_card_view.salary = candidate.professionalDetails.currentSalary;
          candidate_card_view.experience = candidate.professionalDetails.experience;
          candidate_card_view.education = candidate.professionalDetails.education;
          candidate_card_view.proficiencies = candidate.proficiencies;
          candidate_card_view.interestedIndustries = candidate.interestedIndustries;
          candidate_card_view._id = candidate._id;
          candidate_card_view.email = res.email;
          candidate_card_view.first_name = res.first_name;
          candidate_card_view.last_name = res.last_name;
          candidate_card_view.mobile_number = res.mobile_number;
          candidate_card_view.picture = res.picture;
          candidate_card_view.location = candidate.location.city;
          candidate_card_view.noticePeriod =candidate.professionalDetails.noticePeriod;
          if(candidate_card_view.matching >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT){
            count_for_break++;
            card_view_candidates.push(candidate_card_view);
          }

          if (count_for_break == count) {
            if(!isSend){
              isSend=true;
              callback(null, card_view_candidates);
            }
          }
        }
      });

    }
    setTimeout(()=>{
      if(!isSend){
        callback(null, card_view_candidates);
      }
    },3000);


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
