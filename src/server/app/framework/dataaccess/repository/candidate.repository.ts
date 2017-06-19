import CandidateSchema = require("../schemas/candidate.schema");
import RepositoryBase = require("./base/repository.base");
import ICandidate = require("../mongoose/candidate");
import {CandidateQCard} from "../../search/model/candidate-q-card";
import {ConstVariables} from "../../shared/sharedconstants";
import JobProfileModel = require("../model/jobprofile.model");
import CandidateModel = require("../model/candidate.model");
import IndustryModel = require("../model/industry.model");
import CandidateCardViewModel = require("../model/candidate-card-view.model");
import UserRepository = require("./user.repository");
import UserModel = require("../model/user.model");


class CandidateRepository extends RepositoryBase<ICandidate> {

  constructor() {
    super(CandidateSchema);
  }


  getCandidateQCard(candidates: any[], jobProfile: JobProfileModel, candidatesIds: string[], callback: (err: any, res: any) => void) {
    console.time('getCandidateQCardForLoop');
    let job_posted_selected_complexity: string[];
    job_posted_selected_complexity = this.getCodesFromindustry(jobProfile.industry);
    let candidate_q_card_map :any={};
    let idsOfSelectedCandidates : string[]= new Array(0);
    for (let candidate of candidates) {
      let isFound: boolean = false;
      if (candidatesIds) {
        if (candidatesIds.indexOf(candidate._id.toString()) === -1) {
          continue;
        }
      } else {
        if (jobProfile.candidate_list) {
          for (let list of jobProfile.candidate_list) {
            if (list.name === ConstVariables.SHORT_LISTED_CANDIDATE) {
              continue;
            }
            if (list.ids.indexOf(candidate._id.toString()) !== -1) {
              isFound = true;
              break;
            }
          }
        }
        if (isFound) {
          continue;
        }
      }
      let candidate_selected_complexity: string[] = new Array(0);
      let candidate_card_view: CandidateQCard = new CandidateQCard();
      candidate_card_view.matching = 0;
      candidate_selected_complexity = this.getCodesFromindustry(candidate.industry);
      for (let job_item of job_posted_selected_complexity) {
        for (let candi_item of candidate_selected_complexity) {
          if (job_item.substr(0, job_item.lastIndexOf(".")) == candi_item.substr(0, candi_item.lastIndexOf("."))) {
            let job_last_digit: number = Number(job_item.substr(job_item.lastIndexOf(".") + 1));
            let candi_last_digit: number = Number(candi_item.substr(candi_item.lastIndexOf(".") + 1));
            if (candi_last_digit === 0) {

            } else if (candi_last_digit == job_last_digit - ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO) {
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
      candidate_card_view.below_one_step_matching = (candidate_card_view.below_one_step_matching / job_posted_selected_complexity.length) * 100;
      candidate_card_view.exact_matching = (candidate_card_view.exact_matching / job_posted_selected_complexity.length) * 100;
      candidate_card_view.matching = candidate_card_view.above_one_step_matching + candidate_card_view.below_one_step_matching + candidate_card_view.exact_matching;
      candidate_card_view.salary = candidate.professionalDetails.currentSalary;
      candidate_card_view.experience = candidate.professionalDetails.experience;
      candidate_card_view.education = candidate.professionalDetails.education;
      candidate_card_view.proficiencies = candidate.proficiencies;
      candidate_card_view.interestedIndustries = candidate.interestedIndustries;
      candidate_card_view._id = candidate._id;
      candidate_card_view.location = candidate.location.city;
      candidate_card_view.noticePeriod = candidate.professionalDetails.noticePeriod;
      if (candidate_card_view.matching >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
        candidate_q_card_map[candidate.userId]=candidate_card_view;
        idsOfSelectedCandidates.push(candidate.userId);
      }

    }
    let candidates_q_cards_send : CandidateQCard[] = new Array(0);
    let userRepository: UserRepository = new UserRepository();
    console.timeEnd('getCandidateQCardForLoop');
    userRepository.retrieveByMultiIds(idsOfSelectedCandidates,{}, (error: any, res: any) => {
      if (error) {
        callback(error, null);
      }
       else {
        if(res.length>0){
          console.time('retrieveByMultiIds');
          for(let user of res){
            let candidateQcard : CandidateQCard= candidate_q_card_map[user._id];
            candidateQcard.email=user.email;
            candidateQcard.first_name=user.first_name;
            candidateQcard.last_name=user.last_name;
            candidateQcard.mobile_number=user.mobile_number;
            candidateQcard.picture=user.picture;
            candidates_q_cards_send.push(candidateQcard);
          }
          console.timeEnd('retrieveByMultiIds');
          callback(null,candidates_q_cards_send);
        }else {
          callback(null,candidates_q_cards_send);
        }
      }
    });


  }

  getCodesFromindustry(industry: IndustryModel): string[] {
    console.time('getCodesFromindustry');
    let selected_complexity: string[] = new Array(0);
    for (let role of industry.roles) {
      for (let capability of role.default_complexities) {
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
    console.time('getCodesFromindustry');
    return selected_complexity;
  }


}

Object
  .seal(CandidateRepository);

export = CandidateRepository;
