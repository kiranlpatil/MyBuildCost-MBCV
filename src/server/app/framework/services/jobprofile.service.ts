import * as fs from 'fs';
var config = require('config');
import Messages = require("../shared/messages");
import ProjectAsset = require("../shared/projectasset");
import UserRepository = require("../dataaccess/repository/user.repository");
import LocationRepository = require("../dataaccess/repository/location.repository");
import RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
import JobProfileRepository = require("../dataaccess/repository/job-profile.repository");
import CandidateRepository = require("../dataaccess/repository/candidate.repository");
import JobProfileModel = require("../dataaccess/model/jobprofile.model");
import CandidateSearchRepository = require("../search/candidate-search.repository");

class JobProfileService {
  private jobprofileRepository:JobProfileRepository;
  private candidateSearchRepository : CandidateSearchRepository

  APP_NAME:string;

  constructor() {
    this.jobprofileRepository = new JobProfileRepository();
    this.candidateSearchRepository = new CandidateSearchRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  create(item:any, callback:(error:any, result:any) => void) {
    this.jobprofileRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error(err), null);
      } else {
        callback(null, res);
      }
    });
  }

  searchCandidatesByJobProfile(jobProfile:JobProfileModel, callback:(error:any, result:any)=>void) {

    this.candidateSearchRepository.getCandidateByIndustry(jobProfile, (err, res)=> {
      if (err) {
        callback(new Error(err), null);
      } else {
        callback(null, res);
      }
    });
  }


}

Object.seal(JobProfileService);
export = JobProfileService;
