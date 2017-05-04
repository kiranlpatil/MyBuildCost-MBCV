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

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.recruiterRepository.retrieve(field, (err, res) => {
      let isFound : boolean=false;
      if (res.length > 0) {
        let jobProfile = JSON.parse(JSON.stringify(field))
        for (let item of res[0].postedJobs) {
          console.log("in If condi "+JSON.stringify(field)+"==="+item._id)

            if("58f9e8c004b81e852e17c209"===item._id.toString()){//new mongoose.Types.ObjectId(item._id)){
              console.log("True condition");
              callback(null,item);
            }
        }
        if(!isFound){
          callback(new Error("Not Found Any Job posted"),null);
        }
      }
    });
  }


}

Object.seal(JobProfileService);
export = JobProfileService;
