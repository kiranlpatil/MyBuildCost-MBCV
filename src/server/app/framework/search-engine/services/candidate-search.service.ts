import { SearchService } from './search.service';
import RecruiterRepository = require('../../dataaccess/repository/recruiter.repository');
import { JobDetail } from '../models/output-model/job-detail';
import JobProfileModel = require('../../dataaccess/model/jobprofile.model');
import { BaseDetail } from '../models/output-model/base-detail';
import { EList } from '../models/input-model/list-enum';
import CandidateRepository = require('../../dataaccess/repository/candidate.repository');
import ICandidate = require('../../dataaccess/mongoose/candidate');
import CandidateModel = require('../../dataaccess/model/candidate.model');
import RecruiterClassModel = require('../../dataaccess/model/recruiterClass.model');
import { ConstVariables } from '../../shared/sharedconstants';
import * as mongoose from 'mongoose';

export class CandidateSearchService extends SearchService {
  recruiterRepository : RecruiterRepository;
  constructor() {
    super();
    this.recruiterRepository= new RecruiterRepository();
  }
  getUserDetails(jobId: string, callback : (err : Error, res : BaseDetail)=> void) : void {

/*    this.recruiterRepository.getJobById(jobId, (myError: Error, response : JobProfileModel) => {
        if(myError) {
          callback(myError, null);
          return ;
        }
        let jobDetail = new JobDetail();
        jobDetail.interestedIndustries= response.interestedIndustries;
        jobDetail.industryName = response.industry.name;
        jobDetail.relevantIndustries = response.releventIndustries;
        jobDetail.city = response.location.city;
        jobDetail.candidateList = response.candidate_list;
        jobDetail.capability_matrix = response.capability_matrix;
        callback(null,jobDetail);
    });*/
  }

  getIdsByList(jobDetail : JobDetail, listName : EList) : mongoose.Types.ObjectId [] {
      let list : string;
      switch (listName) {
        case EList.CAN_APPLIED :
          list =ConstVariables.APPLIED_CANDIDATE;
          break;
        case EList.CAN_CART :
          list =ConstVariables.CART_LISTED_CANDIDATE;
          break;
        case EList.CAN_REJECTED :
          list =ConstVariables.REJECTED_LISTED_CANDIDATE;
          break;
      }
      let send_ids : mongoose.Types.ObjectId[];
      send_ids  = new Array(0);
      for(let obj of jobDetail.candidateList) {
        if (list === obj.name) {
          for(let id of obj.ids) {
            send_ids.push(mongoose.Types.ObjectId(id));
          }
          break;
        }
      }
      return send_ids;
  }

}
