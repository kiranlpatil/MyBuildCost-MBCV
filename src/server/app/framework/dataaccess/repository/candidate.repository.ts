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
    let candidate_q_card_map :any = { };
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
      let candidate_card_view: CandidateQCard = new CandidateQCard();
      candidate_card_view.matching = 0;
      let count =0;
      for (let cap in jobProfile.capability_matrix) {
        if (jobProfile.capability_matrix[cap] == -1 || jobProfile.capability_matrix[cap] == 0 || jobProfile.capability_matrix[cap] == undefined) {
        } else if (jobProfile.capability_matrix[cap] == candidate.capability_matrix[cap]) {
            candidate_card_view.exact_matching += 1;
          count++;
        } else if (jobProfile.capability_matrix[cap] == (Number(candidate.capability_matrix[cap]) - ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
          candidate_card_view.above_one_step_matching += 1;
          count++;
        } else if (jobProfile.capability_matrix[cap] == (Number(candidate.capability_matrix[cap]) + ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
          candidate_card_view.below_one_step_matching += 1;
          count++;
        }  else {
          count++;
        }
      }
      for(let cap in jobProfile.capability_matrix) {
        if (jobProfile.complexity_musthave_matrix == -1 || jobProfile.complexity_musthave_matrix == undefined) {
          candidate_card_view.complexityIsMustHave = false;
        } else if(jobProfile.complexity_musthave_matrix[cap]) {
          if(jobProfile.capability_matrix[cap] == candidate.capability_matrix[cap]) {
            candidate_card_view.complexityIsMustHave = jobProfile.complexity_musthave_matrix[cap];
          } else {
            candidate_card_view.complexityIsMustHave = false;
          }
        }
      }
      candidate_card_view.above_one_step_matching = (candidate_card_view.above_one_step_matching / count) * 100;
      candidate_card_view.below_one_step_matching = (candidate_card_view.below_one_step_matching / count) * 100;
      candidate_card_view.exact_matching = (candidate_card_view.exact_matching / count) * 100;
      candidate_card_view.matching = candidate_card_view.above_one_step_matching + candidate_card_view.below_one_step_matching + candidate_card_view.exact_matching;
      candidate_card_view.salary = candidate.professionalDetails.currentSalary;
      candidate_card_view.experience = candidate.professionalDetails.experience;
      candidate_card_view.education = candidate.professionalDetails.education;
      candidate_card_view.proficiencies = candidate.proficiencies;
      candidate_card_view.interestedIndustries = candidate.interestedIndustries;
      candidate_card_view._id = candidate._id;//todo solve the problem of location from front end
      candidate_card_view.isVisible = candidate.isVisible;
      if(candidate.location) {
        candidate_card_view.location = candidate.location.city;
      }else {
        candidate_card_view.location = 'Pune';
      }
      candidate_card_view.noticePeriod = candidate.professionalDetails.noticePeriod;
      if ((candidate_card_view.above_one_step_matching + candidate_card_view.exact_matching) >= ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
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
        if(res.length>0) {
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
          candidates_q_cards_send.sort((first: CandidateQCard,second : CandidateQCard):number=> {
            if((first.above_one_step_matching+first.exact_matching) >(second.above_one_step_matching+second.exact_matching) ){
              return -1;
            }
            if((first.above_one_step_matching+first.exact_matching) < (second.above_one_step_matching+second.exact_matching) ) {
              return 1;
            }
            return 0;
          });
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
