import CandidateSchema = require('../schemas/candidate.schema');
import RepositoryBase = require('./base/repository.base');
import ICandidate = require('../mongoose/candidate');
import { CandidateQCard } from '../../search/model/candidate-q-card';
import { ConstVariables } from '../../shared/sharedconstants';
import JobProfileModel = require('../model/jobprofile.model');
import CandidateModel = require('../model/candidate.model');
import IndustryModel = require('../model/industry.model');
import CandidateCardViewModel = require('../model/candidate-card-view.model');
import UserRepository = require('./user.repository');
import UserModel = require('../model/user.model');
import { CommonSearchService } from '../../search/services/common.search.service';


class CandidateRepository extends RepositoryBase<ICandidate> {

  constructor() {
    super(CandidateSchema);
  }

  getCandidateQCard(candidates: any[], jobProfile: JobProfileModel, candidatesIds: any[], sortBy: string,
                    callback: (err: any, res: any) => void) {
    let candidates_q_cards_send: CandidateQCard[] = new Array(0);
    candidatesLoop: for (let candidate of candidates) {
      if(this.isCandidatePresentInList(candidatesIds,candidate._id.toString())) {
        continue;
      }
      if (jobProfile.candidate_list) {
        for (let list of jobProfile.candidate_list) {
          if (list.name !== ConstVariables.SHORT_LISTED_CANDIDATE &&
            list.ids.indexOf(candidate._id.toString()) !== -1) {
            continue candidatesLoop;
          }
        }
      }
      let candidate_card_view: CandidateQCard = new CandidateQCard();
      candidate_card_view = CommonSearchService.setQcardData(candidate_card_view, jobProfile, candidate);
      candidate_card_view = CommonSearchService.setMustHaveMatrix(jobProfile, candidate, candidate_card_view);
      this.setQcardData(candidate_card_view, candidate);
      if ((candidate_card_view.above_one_step_matching + candidate_card_view.exact_matching) >=
        ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
        if ('Best match' !== sortBy) {
          if (candidates_q_cards_send.length < 100) {
            candidates_q_cards_send.push(candidate_card_view);
          } else {
            break;
          }
        } else {
          candidates_q_cards_send.push(candidate_card_view);
        }
      }
    }
    if ('Best match' !== sortBy.toString()) {
      callback(null, candidates_q_cards_send);
    } else {
      candidates_q_cards_send = this.getSortedQCard(candidates_q_cards_send);
      let q_cards = candidates_q_cards_send.slice(0, 100);
      callback(null, q_cards);
    }
  }


  getSortedQCard(candidates_q_cards : CandidateQCard [] ) {
    candidates_q_cards.sort((first: CandidateQCard,second : CandidateQCard):number=> {
      if((first.above_one_step_matching+first.exact_matching) >(second.above_one_step_matching+second.exact_matching) ) {
        return -1;
      }
      if((first.above_one_step_matching+first.exact_matching) < (second.above_one_step_matching+second.exact_matching) ) {
        return 1;
      }
      return 0;
    });
    return candidates_q_cards;
  }

  isCandidatePresentInList(candidatesIds : any[], _id :string) : boolean {
    if (candidatesIds) {
      let isIdFound: boolean = false;
      for (let id of candidatesIds) {
        if (id.toString() === _id) {
          isIdFound = true;
        }
      }
      return !isIdFound;
    }
    return false;
  }

  setQcardData(candidate_card_view : any ,candidate: any ) {
    candidate_card_view.salary = candidate.professionalDetails.currentSalary;
    candidate_card_view.experience = candidate.professionalDetails.experience;
    candidate_card_view.education = candidate.professionalDetails.education;
    candidate_card_view.proficiencies = candidate.proficiencies;
    candidate_card_view.interestedIndustries = candidate.interestedIndustries;
    candidate_card_view._id = candidate._id;
    candidate_card_view.isVisible = candidate.isVisible;
    candidate_card_view.email = candidate.userId.email;
    candidate_card_view.first_name = candidate.userId.first_name;
    candidate_card_view.last_name = candidate.userId.last_name;
    candidate_card_view.mobile_number = candidate.userId.mobile_number;
    candidate_card_view.picture = candidate.userId.picture;
    candidate_card_view.location = candidate.location.city;
   candidate_card_view.noticePeriod = candidate.professionalDetails.noticePeriod;
   return candidate_card_view;
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
