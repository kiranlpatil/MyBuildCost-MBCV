import * as mongoose from "mongoose";
import {Recruiter} from "../dataaccess/model/recruiter-final.model";
import {ConstVariables} from "../shared/sharedconstants";
import {JobCountModel} from "../dataaccess/model/job-count.model";
import Messages = require('../shared/messages');
import UserRepository = require('../dataaccess/repository/user.repository');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import JobProfileModel = require('../dataaccess/model/jobprofile.model');
import CandidateRepository = require('../dataaccess/repository/candidate.repository');
import CapabilityMatrixService = require('./capbility-matrix.builder');
import IndustryModel = require('../dataaccess/model/industry.model');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import RecruiterModel = require('../dataaccess/model/recruiter.model');
import RecruiterClassModel = require('../dataaccess/model/recruiterClass.model');
import CandidateService = require('./candidate.service');
var bcrypt = require('bcrypt');

class RecruiterService {
  APP_NAME:string;
  private recruiterRepository:RecruiterRepository;
  private candidateRepository:CandidateRepository;
  private userRepository:UserRepository;
  private industryRepository:IndustryRepository;

  constructor() {
    this.recruiterRepository = new RecruiterRepository();
    this.userRepository = new UserRepository();
    this.industryRepository = new IndustryRepository();
    this.candidateRepository = new CandidateRepository();
  }

  createUser(item:any, callback:(error:any, result:any) => void) {
    this.userRepository.retrieve({'email': item.email}, (err, res) => {
      if (err) {
        callback(new Error(err), null);
      } else if (res.length > 0) {
        if (res[0].isActivated === true) {
          callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
        } else if (res[0].isActivated === false) {
          callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
        }
      } else {
        item.isActivated = false;
        item.isCandidate = false;
        const saltRounds = 10;
        bcrypt.hash(item.password, saltRounds, (err:any, hash:any) => {
          if (err) {
            callback(new Error(Messages.MSG_ERROR_BCRYPT_CREATION), null);
          } else {
            item.password = hash;
            this.userRepository.create(item, (err, res) => {
              if (err) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
              } else {
                let userId1 = res._id;
                let newItem:any = {
                  isRecruitingForself: item.isRecruitingForself,
                  company_name: item.company_name,
                  company_size: item.company_size,
                  company_logo: item.company_logo,
                  company_website: item.company_website,
                  userId: userId1
                };
                this.recruiterRepository.create(newItem, (err:any, res:any) => {
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

  findOneAndUpdate(query:any, newData:any, options:any, callback:(error:any, result:any) => void) {
    this.recruiterRepository.findOneAndUpdate(query, newData, options, callback);
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this.recruiterRepository.retrieve(field, (err, res) => {
      if (err) {
        let er = new Error('Unable to retrieve recruiter details.');
        callback(er, null);
      } else {
        let recruiter:Recruiter;
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

  addJob(_id:string, item:any, callback:(error:any, result:any) => void) { //Todo change with candidate_id now it is a user_id operation
    this.recruiterRepository.findOneAndUpdate({'userId': new mongoose.Types.ObjectId(_id)},
      {$push: {postedJobs: item.postedJobs}},
      {
        'new': true, select: {
        postedJobs: {
          $elemMatch: {'postingDate': item.postedJobs.postingDate}
        }
      }
      },
      function (err, record) {
        if (record) {
          callback(null, record);
        } else {
          let error:any;
          if (record === null) {
            error = new Error('Unable to update posted job maybe recruiter not found. ');
            callback(error, null);
          } else {
            callback(err, null);
          }
        }
      });
  }

  addCloneJob(_id:string, item:any, callback:(error:any, result:any) => void) { //Todo change with candidate_id now it is a user_id operation
    this.recruiterRepository.findOneAndUpdate({'userId': new mongoose.Types.ObjectId(_id)},
      {$push: {postedJobs: item}},
      {
        'new': true, select: {
        postedJobs: {
          $elemMatch: {'postingDate': item.postingDate}
        }
      }
      },
      function (err, record) {
        if (record) {
          callback(null, record);
        } else {
          let error:any;
          if (record === null) {
            error = new Error( 'Job cloning is failed' );
            callback(error, null);
          } else {
            callback(err, null);
          }
        }
      });
  }

  updateJob(_id:string, item:any, callback:(error:any, result:any) => void) { //Todo change with candidate_id now it is a user_id operation

    let capabilityMatrixService:CapabilityMatrixService = new CapabilityMatrixService();
    this.industryRepository.retrieve({'name': item.postedJobs.industry.name}, (error:any, industries:IndustryModel[]) => {
      if (error) {
        callback(error, null);
      } else {
        if (item.postedJobs.capability_matrix === undefined) {
          item.postedJobs.capability_matrix = {};
        }
        let new_capability_matrix:any = {};
        item.postedJobs.capability_matrix = capabilityMatrixService.getCapabilityMatrix(item.postedJobs, industries, new_capability_matrix);
        this.recruiterRepository.findOneAndUpdate(
          {
            'userId': new mongoose.Types.ObjectId(_id),
            'postedJobs._id': new mongoose.Types.ObjectId(item.postedJobs._id)
          },
          {$set: {'postedJobs.$': item.postedJobs}},
          {
            'new': true, select: {
            postedJobs: {
              $elemMatch: {'postingDate': item.postedJobs.postingDate}
            }
          }
          },
          function (err, record) {
            if (record) {
              callback(null, record);
            } else {
              let error:any;
              if (record === null) {
                error = new Error('Unable to update posted job maybe recruiter & job post not found. ');
                callback(error, null);
              } else {
                callback(err, null);
              }
            }
          });
      }
    });
  }


  findById(id:any, callback:(error:any, result:any) => void) {
    this.recruiterRepository.findById(id, callback);
  }


  getList(item:any, callback:(error:any, result:any) => void) {
    let query = {
      'postedJobs._id': {$in: item.ids},
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

  updateDetails(_id:string, item:any, callback:(error:any, result:any) => void) {

    this.recruiterRepository.retrieve({'userId': new mongoose.Types.ObjectId(_id)}, (err, res) => {

      if (err) {
        callback(err, res);
      } else {
        this.recruiterRepository.findOneAndUpdate({'_id': res[0]._id}, item, {'new': true}, callback);
      }
    });
  }

  getCandidateList(item:any, callback:(error:any, result:any) => void) {
    let query = {
      'postedJobs': {$elemMatch: {'_id': new mongoose.Types.ObjectId(item.jobProfileId)}}
    };
    this.recruiterRepository.retrieve(query, (err, res) => {
      if (err) {
        callback(new Error('Not Found Any Job posted'), null);
      } else {
        if (res.length > 0) {
          let candidateIds:string[] = new Array(0);
          let jobProfile:JobProfileModel;
          for (let job of res[0].postedJobs) {
            if (job._id.toString() === item.jobProfileId) {
              jobProfile = job;
              for (let list of job.candidate_list) {
                if (list.name.toString() === item.listName.toString()) {
                  candidateIds = list.ids;
                }
              }
            }
          }
          this.candidateRepository.retrieveByMultiIds(candidateIds, {}, (err:any, res:any) => {
            if (err) {
              callback(new Error('Candidates are not founds'), null);
            } else {
              this.candidateRepository.getCandidateQCard(res, jobProfile, candidateIds, callback);
            }
          });
        }
      }
    });
  }

  getJobById(id:string, callback:(error:any, result:JobProfileModel) => void) {
    let query = {
      'postedJobs': {$elemMatch: {'_id': new mongoose.Types.ObjectId(id)}}
    };
    this.recruiterRepository.retrieve(query, (err:any, res:RecruiterModel[]) => {
      if (err) {
        callback(new Error('Problem in Job Retrieve'), null);
      } else {
        let jobProfile:JobProfileModel;
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

  loadCapbilityAndKeySkills(postedJob:JobProfileModel[], industries:IndustryModel[]) {
    let candidateService = new CandidateService();
    for (let i = 0; i < postedJob.length; i++) {
      let capability = candidateService.getCapabilitiesBuild(postedJob[i].capability_matrix, postedJob[i].industry.roles, industries);
      postedJob[i].capability = capability;
      postedJob[i].keySkills = postedJob[i].proficiencies.toString().replace(/,/g, ' $');
      postedJob[i].additionalKeySkills = postedJob[i].additionalProficiencies.toString().replace(/,/g, ' $');
    }
  }
}

Object.seal(RecruiterService);
export = RecruiterService;
