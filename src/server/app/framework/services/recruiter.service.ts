import * as mongoose from "mongoose";
import {Recruiter} from "../dataaccess/model/recruiter-final.model";
import {ConstVariables} from "../shared/sharedconstants";
import {JobCountModel} from "../dataaccess/model/job-count.model";
var config = require('config');

import Messages = require('../shared/messages');
import ProjectAsset = require('../shared/projectasset');
import UserRepository = require('../dataaccess/repository/user.repository');
import LocationRepository = require('../dataaccess/repository/location.repository');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import JobProfileModel = require('../dataaccess/model/jobprofile.model');
import CandidateRepository = require('../dataaccess/repository/candidate.repository');
import RecruiterModel = require('../dataaccess/model/recruiter.model');
import CapabilityMatrixService = require('./capbility-matrix.builder');
import IndustryModel = require('../dataaccess/model/industry.model');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
var bcrypt = require('bcrypt');

class RecruiterService {
  private recruiterRepository: RecruiterRepository;
  private candidateRepository: CandidateRepository;
  private userRepository: UserRepository;
  private locationRepository: LocationRepository;
  private industryRepositiry: IndustryRepository;

  APP_NAME: string;

  constructor() {
    this.recruiterRepository = new RecruiterRepository();
    this.userRepository = new UserRepository();
    this.industryRepositiry = new IndustryRepository();
    this.locationRepository = new LocationRepository();
    this.candidateRepository = new CandidateRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  createUser(item: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve({"email": item.email}, (err, res) => {
      if (err) {
        callback(new Error(err), null);
      }
      else if (res.length > 0) {
        if (res[0].isActivated === true) {
          callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
        } else if (res[0].isActivated === false) {
          callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
        }
      }else {
            item.isActivated = false;
            item.isCandidate = false;
            const saltRounds = 10;
            bcrypt.hash(item.password, saltRounds, (err:any, hash:any) => {
              if(err) {
                callback(new Error('Error in creating hash using bcrypt'),null);
              } else {
                item.password = hash;
                this.userRepository.create(item, (err, res) => {
                  if (err) {
                    callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
                  }else {
                    var userId1 = res._id;
                    var newItem: any = {
                      isRecruitingForself: item.isRecruitingForself,
                      company_name: item.company_name,
                      company_size: item.company_size,
                      company_logo: item.company_logo,
                      userId: userId1
                    };
                    this.recruiterRepository.create(newItem, (err: any, res: any) => {
                      if (err) {
                        callback(err, null);
                      } else {
                        callback(null, res);
                      }
                    });
                  }
                });
              }
            });
      }
    });
  }

  findOneAndUpdate(query: any, newData: any, options: any, callback: (error: any, result: any) => void) {
    this.recruiterRepository.findOneAndUpdate(query, newData, options, callback);
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.recruiterRepository.retrieve(field, (err, res) => {
      if (err) {
        let er = new Error("Unable to retrieve recruiter details.");
        callback(er, null);
      } else {
        let recruiter: Recruiter = new Recruiter();
        recruiter = res[0];
        if (recruiter) {
          recruiter.jobCountModel = new JobCountModel();
          recruiter.jobCountModel.numberOfJobposted = recruiter.postedJobs.length;
        }
        if (res.length > 0) {
          if (recruiter.postedJobs) {
            for (let job of recruiter.postedJobs) {
              for (let list of job.candidate_list) {
                switch (list.name) {
                  case ConstVariables.APPLIED_CANDIDATE :
                    recruiter.jobCountModel.totalNumberOfCandidatesApplied += list.ids.length;
                    break;
                  case ConstVariables.CART_LISTED_CANDIDATE :
                    recruiter.jobCountModel.totalNumberOfCandidateInCart += list.ids.length;
                    break;
                  case ConstVariables.REJECTED_LISTED_CANDIDATE :
                    recruiter.jobCountModel.totalNumberOfCandidatesRejected += list.ids.length;
                    break;
                  default :
                    break;
                }
              }
            }
          }
        }
        callback(null, [recruiter]);
      }
    });
  }

  addJob(_id: string, item: any, callback: (error: any, result: any) => void) { //Todo change with candidate_id now it is a user_id operation
    this.recruiterRepository.findOneAndUpdate({"userId": new mongoose.Types.ObjectId(_id)},
      {$push: {postedJobs: item.postedJobs}},
      {
        "new": true, select: {
        postedJobs: {
          $elemMatch: {"postingDate": item.postedJobs.postingDate}
        }
      }
      },
      function (err, record) {
        if (record) {
          callback(null, record);
        } else {
          let error: any;
          if (record === null) {
            error = new Error("Unable to update posted job maybe recruiter not found. ");
            callback(error, null);
          }
          else {
            callback(err, null);
          }
        }
      });
  }

  updateJob(_id: string, item: any, callback: (error: any, result: any) => void) { //Todo change with candidate_id now it is a user_id operation

    var capabilityMatrixService: CapabilityMatrixService = new CapabilityMatrixService();
    this.industryRepositiry.retrieve({'name': item.postedJobs.industry.name}, (error: any, industries: IndustryModel[]) => {
      if (error) {
        callback(error, null);
      } else {
        if (item.postedJobs.capability_matrix === undefined) {
          item.postedJobs.capability_matrix = {};
        }
        let new_capability_matrix: any = {};
        /* if (item.industry.roles && item.industry.roles.length > 0) {
         for (let role of item.industry.roles) {
         if (role.capabilities && role.capabilities.length > 0) {
         for (let capability of role.capabilities) {
         if (capability.code) {
         for (let mainRole of industries[0].roles) {
         if (role.code.toString() === mainRole.code.toString()) {
         for (let mainCap of mainRole.capabilities) {
         if (capability.code.toString() === mainCap.code.toString()) {
         for (let mainComp of mainCap.complexities) {
         let itemcode = mainCap.code +'_' + mainComp.code;
         if (item.capability_matrix[itemcode] === undefined) {
         new_capability_matrix[itemcode] = -1;
         item.capability_matrix[itemcode] = -1;
         }else if(item.capability_matrix !== -1) {
         new_capability_matrix[itemcode]= item.capability_matrix[itemcode];
         }else {
         new_capability_matrix[itemcode] = -1;
         }
         }
         }
         }
         }
         }
         }
         }
         }
         for (let capability of  role.default_complexities) {
         if (capability.code) {
         for (let mainRole of industries[0].roles) {
         if (role.code.toString() === mainRole.code.toString()) {
         for (let mainCap of mainRole.default_complexities) {
         if (capability.code.toString() === mainCap.code.toString()) {
         for (let mainComp of mainCap.complexities) {
         let itemcode = mainCap.code +'_'+ mainComp.code;
         if (item.capability_matrix[itemcode] === undefined) {
         new_capability_matrix[itemcode] = -1;
         item.capability_matrix[itemcode] = -1;
         }else if(item.capability_matrix !== -1) {
         new_capability_matrix[itemcode]= item.capability_matrix[itemcode];
         }else {
         new_capability_matrix[itemcode] = -1;
         }
         }
         }
         }
         }
         }
         }
         }
         }
         }
         */
        item.postedJobs.capability_matrix = capabilityMatrixService.getCapabilityMatrix(item.postedJobs, industries, new_capability_matrix);
        this.recruiterRepository.findOneAndUpdate(
          {
            "userId": new mongoose.Types.ObjectId(_id),
            'postedJobs._id': new mongoose.Types.ObjectId(item.postedJobs._id)
          },
          {$set: {'postedJobs.$': item.postedJobs}},
          {
            "new": true, select: {
            postedJobs: {
              $elemMatch: {"postingDate": item.postedJobs.postingDate}
            }
          }
          },
          function (err, record) {
            if (record) {
              callback(null, record);
            } else {
              let error: any;
              if (record === null) {
                error = new Error("Unable to update posted job maybe recruiter & job post not found. ");
                callback(error, null);
              } else {
                callback(err, null);
              }
            }
          });
      }
    });
  }


  findById(id: any, callback: (error: any, result: any) => void) {
    this.recruiterRepository.findById(id, callback);
  }


  getList(item: any, callback: (error: any, result: any) => void) {
    console.log("333333333333333");
    let query = {
      "postedJobs._id": {$in: item.ids},
    };
    this.recruiterRepository.retrieve(query, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        this.recruiterRepository.getJobProfileQCard(res, item.candidate, item.ids, 'none', (canError, canResult) => {
          if (canError) {
            callback(canError, null);
          } else {
            callback(null, canResult);
          }
        });
      }
    });
  }

  updateDetails(_id: string, item: any, callback: (error: any, result: any) => void) {

    this.recruiterRepository.retrieve({"userId": new mongoose.Types.ObjectId(_id)}, (err, res) => {

      if (err) {
        callback(err, res);
      }
      else {
        this.recruiterRepository.findOneAndUpdate({'_id': res[0]._id}, item, {new: true}, callback);
      }
    });
  }

  getCandidateList(item: any, callback: (error: any, result: any) => void) {
    let query = {
      "postedJobs": {$elemMatch: {"_id": new mongoose.Types.ObjectId(item.jobProfileId)}}
    };
    this.recruiterRepository.retrieve(query, (err, res) => {
      if (err) {
        callback(new Error("Not Found Any Job posted"), null);
      }
      else {
        if (res.length > 0) {
          let candidateIds: string[] = new Array(0);
          let jobProfile: JobProfileModel;
          for (let job of res[0].postedJobs) {
            if (job._id.toString() === item.jobProfileId) {
              jobProfile = job;
              for (let list of job.candidate_list) {
                if (list.name == item.listName) {
                  candidateIds = list.ids;
                }
              }
            }
          }
          this.candidateRepository.retrieveByMultiIds(candidateIds, {}, (err: any, res: any) => {
            if (err) {
              callback(new Error("Candidates are not founds"), null);
            } else {
              this.candidateRepository.getCandidateQCard(res, jobProfile, candidateIds, callback);
            }
          })
        }
      }
    });
  }

  getJobById(id: any, callback: (error: any, result: any) => void) {
    let query = {
      "postedJobs": {$elemMatch: {"_id": new mongoose.Types.ObjectId(id)}}
    };
    this.recruiterRepository.retrieve(query, (err: any, res: any) => {
      if (err) {
        callback(new Error("Problem in Job Retrieve"), null);
      } else {
        let jobProfile: JobProfileModel;
        if (res.length > 0) {
          for (let job of res[0].postedJobs) {
            if (job._id.toString() === id) {
              jobProfile = job;
            }
          }
        }
        callback(null, jobProfile);
      }
    });
  }

}

Object.seal(RecruiterService);
export = RecruiterService;
