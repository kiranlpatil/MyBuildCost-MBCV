import { SearchService } from './search.service';
import { CandidateDetail } from '../models/output-model/candidate-detail';
import CandidateRepository = require('../../dataaccess/repository/candidate.repository');
import CandidateClassModel = require('../../dataaccess/model/candidate-class.model');
import RecruiterClassModel = require('../../dataaccess/model/recruiterClass.model');
import JobProfileModel = require('../../dataaccess/model/jobprofile.model');
import {EList} from '../models/input-model/list-enum';
import * as mongoose from 'mongoose';

export class JobSearchService extends SearchService {
  candidateRepository : CandidateRepository;
  constructor() {
    super();
    this.candidateRepository= new CandidateRepository();
  }

  getUserDetails(canId: string,callback : (err : Error, res : CandidateDetail)=> void) : any {
    this.candidateRepository.findById(canId, (myError: Error, response : any) => {
      if(myError) {
        callback(myError,null);
        return ;
      }
      let canDetail = new CandidateDetail();
      canDetail.industryName= response.industry.name;
      canDetail.capability_matrix = response.capability_matrix;
      callback(null,canDetail);
    });
   }

   getJobsByCriteria (recruiters : RecruiterClassModel[], candidateDetail : CandidateDetail) : any {
  /*  let  jobProfiles : JobProfileModel[] = new Array(0);
    for(let recruiter of recruiters){
          for(let job of recruiter.postedJobs){
            let isRelevantIndustryMatch = false;
            if (job.releventIndustries.indexOf(candidateDetail.industryName) !== -1) {
              isRelevantIndustryMatch = true;
            }
            if ( !job.isJobPosted || job.isJobPostClosed
              || (candidateDetail.industryName !== job.industry.name && !isRelevantIndustryMatch)
              || job.isJobPostExpired
              || (job.expiringDate < new Date())) {
              continue;
            }
            let isPresent : boolean = false;
            for (let industry of candidateDetail.interestedIndustries) {
              if (job.interestedIndustries.indexOf(industry) !== -1) {
                isPresent = true;
              }
            }
            if (candidateDetail.interestedIndustries.indexOf('None') !== -1) {
              isPresent = true;
              break;
            }
            if(!isPresent) {
              continue;
            }
            jobProfiles.push(job);
          }
        }*/
   }

  getIdsByList(candidateDetails: CandidateDetail, listName : EList) : mongoose.Types.ObjectId [] {
    return [];
  }



}
