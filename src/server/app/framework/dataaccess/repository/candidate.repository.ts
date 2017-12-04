import CandidateSchema = require('../schemas/candidate.schema');
import RepositoryBase = require('./base/repository.base');
import ICandidate = require('../mongoose/candidate');
import {CandidateQCard} from '../../search/model/candidate-q-card';
import {
  CandidateProfileCompletionInPercentage, CandidateProfileUpdateTrackServerSide, ConstVariables
} from '../../shared/sharedconstants';
import JobProfileModel = require('../model/jobprofile.model');
import CandidateModel = require('../model/candidate.model');
import IndustryModel = require('../model/industry.model');
import CandidateCardViewModel = require('../model/candidate-card-view.model');
import UserRepository = require('./user.repository');
import UserModel = require('../model/user.model');
import {CommonSearchService} from '../../search/services/common.search.service';
import * as mongoose from 'mongoose';
import {CandidateDetail} from '../../../../../client/app/user/models/candidate-details';


class CandidateRepository extends RepositoryBase<ICandidate> {

  constructor() {
    super(CandidateSchema);
  }

  public retrieveSortedResult(query: any, included: Object, sortingQuery: any, callback: (error: any, result: any) => void) {
    CandidateSchema.find(query, included).sort(sortingQuery).populate('userId').lean().exec(function (err: any, items: any) {
      callback(err, items);
    });
  }

  public retrieveResult(query: any, included: Object, callback: (error: any, result: any) => void) {
    CandidateSchema.find(query, included).lean().exec(function (err: any, items: any) {
      callback(err, items);
    });
  }

  public retrieveAndPopulate(query: Object, included: Object, callback: (error: any, result: any) => void) {
    CandidateSchema.find(query, included).populate('userId').lean().exec(function (err, items) {
      callback(err, items);
    });
  }

  public retrieveCandidate(field: any, callback: (error: any, result: any) => void) {
    CandidateSchema.find(field).populate('userId').lean().exec(function (err, res) {
      callback(err, res);
    });
  }

  getCandidateQCard(candidates: any[], jobProfile: JobProfileModel, candidatesIds: any[], sortBy: string,
                    callback: (err: any, res: any) => void) {
    let candidates_q_cards_send: CandidateQCard[] = new Array(0);
    candidatesLoop: for (let candidate of candidates) {
      if (this.isCandidatePresentInList(candidatesIds, candidate._id.toString())) {
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
      candidate_card_view = CommonSearchService.getCalculatedQcardData(candidate_card_view, jobProfile, candidate);
      candidate_card_view = CommonSearchService.setMustHaveMatrix(jobProfile, candidate, candidate_card_view);
      this.setQcardData(candidate_card_view, candidate);
      if ((candidate_card_view.above_one_step_matching + candidate_card_view.exact_matching) >=
        ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
        if (ConstVariables.BEST_MATCH_SORT !== sortBy) {
          if (candidates_q_cards_send.length < ConstVariables.MAXIMUM_QCARD_FOR_SEARCH_RESULT_RESPONSE) {
            candidates_q_cards_send.push(candidate_card_view);
          } else {
            break;
          }
        } else {
          candidates_q_cards_send.push(candidate_card_view);
        }
      }
    }
    if (ConstVariables.BEST_MATCH_SORT !== sortBy.toString()) {
      callback(null, candidates_q_cards_send);
    } else {
      candidates_q_cards_send = this.getSortedQCard(candidates_q_cards_send);
      let q_cards = candidates_q_cards_send.slice(0, ConstVariables.MAXIMUM_QCARD_FOR_SEARCH_RESULT_RESPONSE);
      callback(null, q_cards);
    }
  }


  getSortedQCard(candidates_q_cards: CandidateQCard []) {
    candidates_q_cards.sort((first: CandidateQCard, second: CandidateQCard): number => {
      if ((first.above_one_step_matching + first.exact_matching) > (second.above_one_step_matching + second.exact_matching)) {
        return -1;
      }
      if ((first.above_one_step_matching + first.exact_matching) < (second.above_one_step_matching + second.exact_matching)) {
        return 1;
      }
      return 0;
    });
    return candidates_q_cards;
  }

  isCandidatePresentInList(candidatesIds: any[], _id: string): boolean {
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

  setQcardData(candidate_card_view: any, candidate: any) {
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

  getLatestCandidatesWithIncompleteProfile(profileComplettionInPercent: CandidateProfileCompletionInPercentage,
                                           fromdate: Date, todate: Date, callback: (err: any, result: any) => void) {
    let data;
    switch (profileComplettionInPercent) {
      case CandidateProfileCompletionInPercentage.COMPLETED_25_PERCENT:
        data = {
          'profile_update_tracking': {$lt: CandidateProfileUpdateTrackServerSide.STEP_IS_COMPLETED_AREA_OF_WORK},
          'lastUpdateAt': {$lt: todate, $gt: new Date(fromdate)}
        };
        break;
      case CandidateProfileCompletionInPercentage.COMPLETED_50_PERCENT:
        data = {
          'profile_update_tracking': {
            $gte: CandidateProfileUpdateTrackServerSide.STEP_IS_COMPLETED_AREA_OF_WORK,
            $lt: CandidateProfileUpdateTrackServerSide.STEP_IS_COMPLETED_CAPABILITIES
          },
          'lastUpdateAt': {$lt: todate, $gt: new Date(fromdate)}
        };
        break;
      case CandidateProfileCompletionInPercentage.COMPLETED_75_PERCENT:
        data = {
          'profile_update_tracking': {
            $gte: CandidateProfileUpdateTrackServerSide.STEP_IS_COMPLETED_CAPABILITIES,
            $lt: CandidateProfileUpdateTrackServerSide.STEP_IS_COMPLETED_COMPLEXITIES
          },
          'lastUpdateAt': {$lt: todate, $gt: new Date(fromdate)}
        };
        break;
      case CandidateProfileCompletionInPercentage.COMPLETED_95_PERCENT:
        data = {
          'profile_update_tracking': {
            $gte: CandidateProfileUpdateTrackServerSide.STEP_IS_COMPLETED_COMPLEXITIES,
            $lt: CandidateProfileUpdateTrackServerSide.STEP_IS_SUBMIT_DETAILS
          },
          'lastUpdateAt': {$lt: todate, $gt: new Date(fromdate)}
        };
        break;
    }

    let candidateRepository = new CandidateRepository();
    candidateRepository.retrieveWithIncluded(data, {'userId': 1, '_id': 0},
      (err: any, res: any) => {
        callback(err, res);
      });
  }

  populateCandidateDetails(candidateId: string, callback: (err: Error, res: CandidateDetail) => void) {
    let candidateRepository = new CandidateRepository();
    candidateRepository.retrieveAndPopulate({'_id': new mongoose.Types.ObjectId(candidateId)},
      {}, (err, candidate) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(err, (candidate[0].userId));
      });
  }
}

Object.seal(CandidateRepository);
export = CandidateRepository;
