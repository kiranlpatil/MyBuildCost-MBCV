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
import * as mongoose from "mongoose";


class JobProfileService {
  private jobprofileRepository:JobProfileRepository;
  private candidateSearchRepository : CandidateSearchRepository
  private  recruiterRepository : RecruiterRepository;
  APP_NAME:string;

  constructor() {
    this.jobprofileRepository = new JobProfileRepository();
    this.candidateSearchRepository = new CandidateSearchRepository();
    this.recruiterRepository = new RecruiterRepository();
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

  retrieve(data: any, callback: (error: any, result: any) => void) {
    let query = {
      "postedJobs":{ $elemMatch: {"_id":new mongoose.Types.ObjectId(data.postedJob)}}
    };
    this.recruiterRepository.retrieve(query, (err, res) => {
      if(err){
        callback(new Error("Not Found Any Job posted"), null);
      }
      else {
        if(res.length > 0)
        {
          for (let job of res[0].postedJobs) {
            if (job._id.toString() === data.postedJob) {
              callback(null, job);
            }
          }
        }
      }
    });
  }


}

Object.seal(JobProfileService);
export = JobProfileService;
