import * as mongoose from "mongoose";
import {Recruiter} from "../dataaccess/model/recruiter-final.model";
import {Actions, ConstVariables} from "../shared/sharedconstants";
import {SharedService} from "../shared/services/shared-service";
import ProjectAsset = require('../shared/projectasset');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import JobProfileRepository = require('../dataaccess/repository/job-profile.repository');
import CandidateRepository = require('../dataaccess/repository/candidate.repository');
import JobProfileModel = require('../dataaccess/model/jobprofile.model');
import CandidateSearchRepository = require('../search/candidate-search.repository');
import IndustryModel = require('../dataaccess/model/industry.model');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import CandidateService = require('./candidate.service');
let usestracking = require('uses-tracking');


class JobProfileService {
  private jobprofileRepository: JobProfileRepository;
  private candidateSearchRepository: CandidateSearchRepository;
  private industryRepository: IndustryRepository;
  private recruiterRepository: RecruiterRepository;
  private candidateRepository: CandidateRepository;
  private APP_NAME: string;
  private usesTrackingController: any;

  constructor() {
    this.jobprofileRepository = new JobProfileRepository();
    this.candidateSearchRepository = new CandidateSearchRepository();
    this.recruiterRepository = new RecruiterRepository();
    this.industryRepository = new IndustryRepository();
    this.candidateRepository = new CandidateRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
    let obj: any = new usestracking.MyController();
    this.usesTrackingController = obj._controller;
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
      'postedJobs': {$elemMatch: {'_id': new mongoose.Types.ObjectId(data.postedJob)}}
    };
    this.recruiterRepository.retrieve(query, (err, res) => {
      if (err) {
        callback(new Error('Not Found Any Job posted'), null);
      } else {
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

  getCapabilityValueKeyMatrix(_id: string,  callback: (error: any, result: any) => void) {
    let data: any = {
      'postedJob': _id
    };
    this.retrieve(data, (err: any, res:Recruiter) => {
      if (err) {
        callback(err, res);
      } else {
        this.industryRepository.retrieve({'name': res.postedJobs[0].industry.name}, (error: any, industries: IndustryModel[]) => {
          if (err) {
            callback(err, res);
          } else {
            let candidateService: CandidateService = new CandidateService();
            let new_capability_matrix: any =  candidateService.getCapabilityValueKeyMatrixBuild(res.postedJobs[0].capability_matrix,industries);
            callback(null, new_capability_matrix);
          }
        });
      }
    });
  }

  update(item: any, callback: (error: any, result: any) => void) {

    let query = {
      'postedJobs': {$elemMatch: {'_id': new mongoose.Types.ObjectId(item.profileId)}}
    };

    let updateFlag = false;

    let updatedQuery1 = {
      '_id': item.recruiterId,
      'postedJobs._id': item.profileId
    };

    let updatedQuery2 = {
      $push: {
        'postedJobs.$.candidate_list': {
          'name': item.listName,
          'ids': item.candidateId
        }
      }
    };

    let updatedQuery3: any;

    let updatedQuery4 = {
      'new': true, 'upsert': true
    };

    this.recruiterRepository.retrieve(query, (err, res) => {
      if (err) {
        callback(new Error('Not Found Any Job posted'), null);
      }
      else {
        if (res.length > 0) {
          for (let job of res[0].postedJobs) {
            if (job._id.toString() === item.profileId) {

              for (let list of job.candidate_list) {
                if (list.name == item.listName) {
                  updateFlag = true;
                  if (item.action == 'add') {
                    let uses_data = {
                      recruiterId: res[0]._id,
                      candidateId: item.candidateId,
                      jobProfileId: job._id,
                      timestamp: new Date(),
                      action: Actions.DEFAULT_VALUE
                    };
                    let sharedService:SharedService = new SharedService();
                    uses_data.action = sharedService.constructAddActionData(item.listName);
                    this.usesTrackingController.create(uses_data);

                    if (list.name == ConstVariables.REJECTED_LISTED_CANDIDATE) {
                      for (let _list of job.candidate_list) {
                        if (_list.name == ConstVariables.CART_LISTED_CANDIDATE) {
                          let index = _list.ids.indexOf(item.candidateId);    // <-- Not supported in <IE9
                          if (index !== -1) {
                            _list.ids.splice(index, 1);
                          }
                        }
                      }
                    }
                    let index = list.ids.indexOf(item.candidateId);    // <-- Not supported in <IE9
                    if (index == -1) {
                      list.ids.push(item.candidateId);

                    }
                  } else {
                    let uses_data = {
                      recruiterId: res[0]._id,
                      candidateId: item.candidateId,
                      jobProfileId: job._id,
                      timestamp: new Date(),
                      action: Actions.DEFAULT_VALUE
                    };
                    let sharedService: SharedService = new SharedService();
                    uses_data.action = sharedService.constructRemoveActionData(item.listName);
                    this.usesTrackingController.create(uses_data);
                    let index = list.ids.indexOf(item.candidateId);    // <-- Not supported in <IE9
                    if (index !== -1) {
                      list.ids.splice(index, 1);
                    }
                  }
                  updatedQuery3 = {
                    $set: {
                      'postedJobs.$.candidate_list': job.candidate_list
                    }
                  };
                  break;
                }
              }

              let param2: any;
              updateFlag ? param2 = updatedQuery3 : param2 = updatedQuery2;

              this.recruiterRepository.findOneAndUpdate(updatedQuery1, param2, updatedQuery4, (err, record) => {
                if (record) {
                  callback(null, record);
                } else {
                  let error: any;
                  if (record === null) {
                    error = new Error('Unable to add candidate.');
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


  applyJob(item: any, callback: (error: any, result: any) => void) {


    this.candidateRepository.retrieve({'_id': new mongoose.Types.ObjectId(item.candidateId)}, (error, response) => {

      if (error) {
        callback(new Error('No candidate Found'), null);
      } else {
        if (response.length > 0) {
          let updateExistingQueryForCandidate: any;
          let isJobFound: boolean = false;
          for (let list of response[0].job_list) {
            if (list.name == item.listName) {
              isJobFound = true;
              if (item.action == 'add') {
                let index = list.ids.indexOf(item.profileId);
                if (index == -1) {
                  let uses_data = {
                    candidateId: item.candidateId,
                    jobProfileId: item.profileId,
                    timestamp: new Date(),
                    action: Actions.DEFAULT_VALUE
                  };
                  let sharedService: SharedService = new SharedService();
                  uses_data.action = sharedService.constructAddActionData(item.listName);
                  this.usesTrackingController.create(uses_data);
                  list.ids.push(item.profileId);
                }
              } else if (item.action == 'remove' && item.listName != 'applied') {
                let uses_data = {
                  candidateId: item.candidateId,
                  jobProfileId: item.profileId,
                  timestamp: new Date(),
                  action: Actions.DEFAULT_VALUE
                };
                let sharedService: SharedService = new SharedService();
                uses_data.action = sharedService.constructRemoveActionData(item.listName);
                this.usesTrackingController.create(uses_data);
                let index = list.ids.indexOf(item.profileId);
                if (index !== -1) {
                  list.ids.splice(index, 1);
                }
              }
              updateExistingQueryForCandidate = {
                $set: {
                  'job_list': response[0].job_list
                }
              };
              break;
            }
          }
          let newEntryQueryForCandidate = {
            $push: {
              'job_list': {
                'name': item.listName,
                'ids': item.profileId
              }
            }
          };
          let options = {
            'new': true, 'upsert': true
          };
          let latestQueryForCandidate: any;
          isJobFound ? latestQueryForCandidate = updateExistingQueryForCandidate : latestQueryForCandidate = newEntryQueryForCandidate;
          let candidateSearchQuery = {
            '_id': item.candidateId
          };

          this.candidateRepository.findOneAndUpdate(candidateSearchQuery, latestQueryForCandidate, options, (err, record) => {
            if (record) {
              if (item.listName == 'applied' && item.action == 'add') {
                let query = {
                  'postedJobs': {$elemMatch: {'_id': new mongoose.Types.ObjectId(item.profileId)}}
                };
                let newEntryQuery = {
                  $push: {
                    'postedJobs.$.candidate_list': {
                      'name': ConstVariables.APPLIED_CANDIDATE,
                      'ids': item.candidateId
                    }
                  }
                };
                let updateExistingQuery: any;
                this.recruiterRepository.retrieve(query, (err, res) => {
                  if (err) {
                    callback(new Error('Not Found Any Job posted'), null);
                  }
                  else {
                    let isFound: boolean = false;
                    if (res.length > 0) {
                      for (let job of res[0].postedJobs) {
                        if (job._id.toString() === item.profileId) {
                          for (let list of job.candidate_list) {
                            if (list.name == ConstVariables.APPLIED_CANDIDATE) {
                              isFound = true;
                              let index = list.ids.indexOf(item.candidateId);
                              if (index == -1) {
                                list.ids.push(item.candidateId);
                              }
                              updateExistingQuery = {
                                $set: {
                                  'postedJobs.$.candidate_list': job.candidate_list
                                }
                              };
                              break;
                            }
                          }
                        }
                      }
                      let latestQuery: any;
                      isFound ? latestQuery = updateExistingQuery : latestQuery = newEntryQuery;
                      let recruiterSearchQuery = {
                        '_id': res[0]._id,
                        'postedJobs._id': item.profileId
                      };

                      this.recruiterRepository.findOneAndUpdate(recruiterSearchQuery, latestQuery, options, (err, record) => {
                        if (record) {
                          callback(null, record);
                        } else {
                          let error: any;
                          if (record === null) {
                            error = new Error('Unable to add candidate.');
                            callback(error, null);
                          }
                          else {
                            callback(err, null);
                          }
                        }
                      });
                    }
                  }
                });
              }
              else {
                callback(null, record);
              }
            } else {
              let error: any;
              if (record === null) {
                error = new Error('Unable to add Job to List.');
                callback(error, null);
              }
              else {
                callback(err, null);
              }
            }
          });

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
          'postedJobs': {$elemMatch: {'_id': new mongoose.Types.ObjectId(item.jobId)}}
        };
        this.recruiterRepository.retrieve(query, (err, res) => {
          if (err) {
            callback(new Error('Not Found Any Job posted'), null);
          }
          else {
            if (res.length > 0) {
              let recruiter: Recruiter = new Recruiter();
              recruiter = res[0];
              for (let job of res[0].postedJobs) {
                if (job._id.toString() === item.jobId) {
                  this.candidateRepository.getCandidateQCard(candidateDetails, job, undefined, callback);
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
