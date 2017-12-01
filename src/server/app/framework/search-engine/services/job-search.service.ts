import { SearchService } from './search.service';
import { CandidateDetail } from '../models/output-model/candidate-detail';
import CandidateRepository = require('../../dataaccess/repository/candidate.repository');
import {EList} from '../models/input-model/list-enum';
import * as mongoose from 'mongoose';
import { ConstVariables } from '../../shared/sharedconstants';
import { UtilityFunction } from '../../uitility/utility-function';
import CandidateModel = require('../../dataaccess/model/candidate.model');
import JobProfileModel = require('../../dataaccess/model/jobprofile.model');
import { CandidateDetailsWithJobMatching } from '../../dataaccess/model/candidatedetailswithjobmatching';

export class JobSearchService extends SearchService {
  candidateRepository : CandidateRepository;
  constructor() {
    super();
    this.candidateRepository= new CandidateRepository();
  }

  getCandidateDetails(canId: string, callback: (err: Error, res: any) => void): any {
     this.candidateRepository.findById(canId, (myErr: any, response: any) => {
       if (myErr) {
         callback(myErr, null);
         return;
       }
       callback(null,response);
     });
   }

  getCandidateVisibilityAgainstRecruiter(candidateDetails:any, jobProfiles:JobProfileModel[]) {
    let isGotIt = true;
    let _canDetailsWithJobMatching:CandidateDetailsWithJobMatching = new CandidateDetailsWithJobMatching();
    for (let job of jobProfiles) {
      for (let item of job.candidate_list) {
        if (item.name === 'cartListed') {
          if (item.ids.indexOf(new mongoose.Types.ObjectId(candidateDetails.candidateId).toString()) !== -1) {
            isGotIt = false;
            break;
          }
        }
      }
      if (!isGotIt) {
        break;
      }
    }

    if (isGotIt) {
      candidateDetails.personalDetails.last_name = UtilityFunction.valueHide(candidateDetails.personalDetails.last_name);
      candidateDetails.personalDetails.mobile_number = UtilityFunction.mobileNumberHider(candidateDetails.personalDetails.mobile_number);
      candidateDetails.personalDetails.email = UtilityFunction.emailValueHider(candidateDetails.personalDetails.email);
      candidateDetails.academics = [];
      candidateDetails.employmentHistory = [];
      candidateDetails.areaOfWork = [];
      candidateDetails.proficiencies = [];
      candidateDetails.awards = [];
      candidateDetails.proficiencies = [];
      candidateDetails.personalDetails.password = '';
    }
    _canDetailsWithJobMatching.candidateDetails = candidateDetails;
    _canDetailsWithJobMatching.isShowCandidateDetails = isGotIt;
    return _canDetailsWithJobMatching;
  }
}
