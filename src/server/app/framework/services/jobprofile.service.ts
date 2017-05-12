import * as mongoose from "mongoose";
import {Recruiter} from "../dataaccess/model/recruiter-final.model";
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
import RecruiterModel = require("../dataaccess/model/recruiter.model");


class JobProfileService {
  private jobprofileRepository: JobProfileRepository;
  private candidateSearchRepository: CandidateSearchRepository
  private recruiterRepository: RecruiterRepository;
  candidateRepository: CandidateRepository;
  APP_NAME: string;

  constructor() {
    this.jobprofileRepository = new JobProfileRepository();
    this.candidateSearchRepository = new CandidateSearchRepository();
    this.recruiterRepository = new RecruiterRepository();
    this.candidateRepository = new CandidateRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  create(item: any, callback: (error: any, result: any) => void) {
    this.jobprofileRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error(err), null);
      } else {
        callback(null, res);
      }
    });
  }

  searchCandidatesByJobProfile(jobProfile: JobProfileModel, callback: (error: any, result: any) => void) {

    this.candidateSearchRepository.getCandidateByIndustry(jobProfile, (err, res) => {
      if (err) {
        callback(new Error(err), null);
      } else {
        callback(null, res);
      }
    });
  }

  retrieve(data: any, callback: (error: any, result: any) => void) {
    let query = {
      "postedJobs": {$elemMatch: {"_id": new mongoose.Types.ObjectId(data.postedJob)}}
    };
    this.recruiterRepository.retrieve(query, (err, res) => {
      if (err) {
        callback(new Error("Not Found Any Job posted"), null);
      }
      else {
        if (res.length > 0) {
          let recruiter: Recruiter = new Recruiter();
          recruiter = res[0];
          for (let job of res[0].postedJobs) {
            if (job._id.toString() === data.postedJob) {
              recruiter.postedJobs = new Array(0);
              recruiter.postedJobs.push(job);
              callback(null, recruiter);
            }
          }
        }
      }
    });
  }

  update(item: any, callback: (error: any, result: any) => void) {

    let query = {
      "postedJobs": {$elemMatch: {"_id": new mongoose.Types.ObjectId(item.profileId)}}
    };

    let updateFlag = false;

    let updatedQuery1 = {
      "_id": item.recruiterId,
      "postedJobs._id": item.profileId
    };

    let updatedQuery2 = {
      $push: {
        "postedJobs.$.candidate_list": {
          "name": item.listName,
          "ids": item.candidateId
        }
      }
    };

    let updatedQuery3: any;

    let updatedQuery4 = {
      "new": true, "upsert": true
    };

    this.recruiterRepository.retrieve(query, (err, res) => {
      if (err) {
        callback(new Error("Not Found Any Job posted"), null);
      }
      else {
        if (res.length > 0) {
          for (let job of res[0].postedJobs) {
            if (job._id.toString() === item.profileId) {

              for (let list of job.candidate_list) {
                if (list.name == item.listName) {
                  updateFlag = true;
                  if(item.action=="add") {
                    let index = list.ids.indexOf(item.candidateId);    // <-- Not supported in <IE9
                    if (index == -1) {
                      list.ids.push(item.candidateId);
                    }
                  }else{
                    let index = list.ids.indexOf(item.candidateId);    // <-- Not supported in <IE9
                    if (index !== -1) {
                      list.ids.splice(index, 1);
                    }
                  }
                  updatedQuery3 = {
                    $set: {
                      "postedJobs.$.candidate_list": job.candidate_list
                    }
                  };
                  break;
                }
              }

              let param2: any;
              updateFlag ? param2 = updatedQuery3:param2 = updatedQuery2;

              this.recruiterRepository.findOneAndUpdate(updatedQuery1, param2, updatedQuery4, (err, record) => {
                if (record) {
                  callback(null, record);
                } else {
                  let error: any;
                  if (record === null) {
                    error = new Error("Unable to add candidate.");
                    callback(error, null);
                  }
                  else {
                    callback(err, null);
                  }
                }
              });
            }
          }
        }
      }
    });

  }


  getQCardDetails(item: any, callback: (error: any, result: any) => void) {
    let candidateDetails: any;

    this.candidateRepository.retrieveByMultiIds(item.candidateIds, {}, (err, candidateDetailsRes) => {
      if (err) {
        callback(err, null);
      } else {
        candidateDetails = candidateDetailsRes;
        let query = {
          "postedJobs": {$elemMatch: {"_id": new mongoose.Types.ObjectId(item.jobId)}}
        };
        this.recruiterRepository.retrieve(query, (err, res) => {
          if (err) {
            callback(new Error("Not Found Any Job posted"), null);
          }
          else {
            if (res.length > 0) {
              let recruiter: Recruiter = new Recruiter();
              recruiter = res[0];
              for (let job of res[0].postedJobs) {
                if (job._id.toString() === item.jobId) {
                  this.candidateRepository.getCandidateQCard(candidateDetails, job,true, callback);
                }
              }
            }
          }
        });
      }
    });
  }


}

Object.seal(JobProfileService);
export = JobProfileService;
