import * as mongoose from "mongoose";
import {Actions, ConstVariables} from "../shared/sharedconstants";
import {SharedService} from "../shared/services/shared-service";
import {UsageTracking} from "../dataaccess/model/usage-tracking.model";
import ProjectAsset = require('../shared/projectasset');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import JobProfileRepository = require('../dataaccess/repository/job-profile.repository');
import CandidateRepository = require('../dataaccess/repository/candidate.repository');
import JobProfileModel = require('../dataaccess/model/jobprofile.model');
import CandidateSearchRepository = require('../search/candidate-search.repository');
import IndustryModel = require('../dataaccess/model/industry.model');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import CandidateService = require('./candidate.service');
import IJobProfile = require('../dataaccess/mongoose/job-profile');
import UsageTrackingService = require('./usage-tracking.service');
import RecruiterService = require('./recruiter.service');


class JobProfileService {
  private jobProfileRepository: JobProfileRepository;
  private candidateSearchRepository: CandidateSearchRepository;
  private industryRepository: IndustryRepository;
  private recruiterRepository: RecruiterRepository;
  private candidateRepository: CandidateRepository;
  private APP_NAME: string;

  constructor() {
    this.jobProfileRepository = new JobProfileRepository();
    this.candidateSearchRepository = new CandidateSearchRepository();
    this.recruiterRepository = new RecruiterRepository();
    this.industryRepository = new IndustryRepository();
    this.candidateRepository = new CandidateRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  create(item: any, callback: (error: any, result: IJobProfile) => void) {
    this.jobProfileRepository.create(item, (err, res: IJobProfile) => {
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

  retrieve(data: any, callback: (error: any, result: IJobProfile) => void) {
    this.jobProfileRepository.retrieve(data, (err, res: IJobProfile) => {
      if (err) {
        callback(new Error('Not Found Any Job posted'), null);
        return;
      } else {
        callback(null, res);
      }
    });
  }

  retrieveAll(item: any, callback: (error: any, result: any) => void) {
    this.jobProfileRepository.retrieve(item, (err, res) => {
      if (err) {
        callback(new Error('Not Found Any Job posted'), null);
      } else {
        callback(null, res);
      }
    });
  };

  retrieveByJobId(id: any, callback: (error: any, result: IJobProfile) => void) {
    this.jobProfileRepository.retrieveJobProfiles({'_id': id}, (err: any, res: any) => {
      if (err) {
        callback(new Error('Not Found Any Job posted'), null);
        return;
      } else {
        callback(null, res[0]);
      }
    });
  }


  getCapabilityValueKeyMatrix(_id: string, callback: (error: any, result: any) => void) {
    this.retrieveByJobId(_id, (err: any, res: IJobProfile) => {
      if (err) {
        callback(err, null);
      } else {
        this.industryRepository.retrieve({'name': res.industry.name}, (error: any, industries: IndustryModel[]) => {
          if (err) {
            callback(err, res);
          } else {
            let candidateService: any = new CandidateService();
            let new_capability_matrix: any = candidateService.getCapabilityValueKeyMatrixBuild(res.capability_matrix,
              industries, res.complexity_musthave_matrix);
            callback(null, new_capability_matrix);
          }
        });
      }
    });
  }

  update(item: any, callback: (error: any, result: any) => void) {
    let updateFlag = false;
    let updatedQuery2 = {
      $push: {
        'candidate_list': {
          'name': item.listName,
          'ids': item.candidateId
        }
      }
    };

    let updatedQuery3: any;

    let updatedQuery4 = {
      'new': true, 'upsert': true
    };

    this.jobProfileRepository.findById(item.profileId, (err, job: any) => {
      if (err) {
        callback(new Error('Not Found Any Job posted'), null);
      } else {
        if (job) {
          for (let list of job.candidate_list) {
            if (list.name === item.listName) {
              updateFlag = true;
              let uses_data: UsageTracking = new UsageTracking();
              if (item.action === ConstVariables.ADD_CANDIDATE) {
                uses_data.recruiterId = item.recruiterId;
                uses_data.candidateId = item.candidateId;
                uses_data.jobProfileId = job._id;
                let sharedService: SharedService = new SharedService();
                uses_data.action = sharedService.constructAddActionData(item.listName);

                if (list.name === ConstVariables.REJECTED_LISTED_CANDIDATE) {
                  for (let _list of job.candidate_list) {
                    if (_list.name === ConstVariables.CART_LISTED_CANDIDATE) {
                      let index = _list.ids.indexOf(item.candidateId);    // <-- Not supported in <IE9
                      if (index !== -1) {
                        _list.ids.splice(index, 1);
                      }
                    }
                  }
                }
                if (list.ids.indexOf(item.candidateId) === -1) {
                  list.ids.push(item.candidateId);
                }
              } else {
                uses_data.recruiterId = item.recruiterId;
                uses_data.candidateId = item.candidateId;
                uses_data.jobProfileId = job._id;

                let sharedService: SharedService = new SharedService();
                uses_data.action = sharedService.constructRemoveActionData(item.listName);
                let index = list.ids.indexOf(item.candidateId);    // <-- Not supported in <IE9
                if (index !== -1) {
                  list.ids.splice(index, 1);
                }
              }
              uses_data.timestamp = new Date();
              let usageTrackingService = new UsageTrackingService();
              usageTrackingService.create(uses_data, (err, result) => {
                if (err) {
                  callback(err, null);
                }
              });

              updatedQuery3 = {
                $set: {
                  'candidate_list': job.candidate_list
                }
              };
              break;
            }
          }

          let param2: any;
          updateFlag ? param2 = updatedQuery3 : param2 = updatedQuery2;

          this.jobProfileRepository.findOneAndUpdate({'_id': mongoose.Types.ObjectId(item.profileId)},
            param2, updatedQuery4, (err, record) => {
              if (record) {
                if( item.listName===ConstVariables.CART_LISTED_CANDIDATE  && item.action===ConstVariables.ADD_CANDIDATE) {
                  let candidateService=new CandidateService();
                  candidateService.notifyCandidateOnCartAddition(item.candidateId,item.recruiterId,job.jobTitle,
                    (err:Error,responce:any)=> {
                    if(err) {
                      callback(err,responce);
                      return;
                    }
                      callback(null, record);
                  });
                }else {
                  callback(null, record);
                }
              } else {
                let error: any;
                if (record === null) {
                  error = new Error('Unable to add candidate.');
                  callback(error, null);
                } else {
                  callback(err, null);
                }
              }
            });
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
            if (list.name === item.listName) {
              isJobFound = true;
              if (item.action === ConstVariables.ADD_CANDIDATE) {
                let index = list.ids.indexOf(item.profileId);
                if (index === -1) {
                  let uses_data = {
                    candidateId: item.candidateId,
                    jobProfileId: item.profileId,
                    timestamp: new Date(),
                    action: Actions.DEFAULT_VALUE
                  };
                  let sharedService: SharedService = new SharedService();
                  uses_data.action = sharedService.constructAddActionData(item.listName);
                  //this.usesTrackingController.create(uses_data);
                  list.ids.push(item.profileId);
                }
              } else if (item.action === 'remove' && item.listName !== 'applied') {
                let uses_data = {
                  candidateId: item.candidateId,
                  jobProfileId: item.profileId,
                  timestamp: new Date(),
                  action: Actions.DEFAULT_VALUE
                };
                let sharedService: SharedService = new SharedService();
                uses_data.action = sharedService.constructRemoveActionData(item.listName);
                //this.usesTrackingController.create(uses_data);
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
              if (item.listName === 'applied' && item.action === ConstVariables.ADD_CANDIDATE) {
                let newEntryQuery = {
                  $push: {
                    'candidate_list': {
                      'name': ConstVariables.APPLIED_CANDIDATE,
                      'ids': item.candidateId
                    }
                  }
                };
                let updateExistingQuery: any;
                this.jobProfileRepository.findById(item.profileId, (err: any, job: any) => {
                  if (err) {
                    callback(new Error('Not Found Any Job posted'), null);
                  } else {
                    let isFound: boolean = false;
                    if (job) {
                      for (let list of job.candidate_list) {
                        if (list.name === ConstVariables.APPLIED_CANDIDATE) {
                          isFound = true;
                          if (list.ids.indexOf(item.candidateId) === -1) {
                            list.ids.push(item.candidateId);
                          }
                          updateExistingQuery = {
                            $set: {
                              'candidate_list': job.candidate_list
                            }
                          };
                          break;
                        }
                      }
                      let latestQuery: any;
                      isFound ? latestQuery = updateExistingQuery : latestQuery = newEntryQuery;
                      let jobSearchQuery = {
                        '_id': job._id,
                      };

                      this.jobProfileRepository.findOneAndUpdate(jobSearchQuery, latestQuery, options, (err, record) => {

                        if (record) {
                          let recruiterService=new RecruiterService();
                          recruiterService.notifyOnCandidateJobApply(item.candidateId, job,response,(error, response) => {
                            if(err) {
                              callback(err,response);
                              return;
                            } callback(null, record);
                          });
                        } else {
                          let error: any;
                          if (record === null) {
                            error = new Error('Unable to add candidate.');
                            callback(error, null);
                          } else {
                            callback(err, null);
                          }
                        }
                      });
                    }
                  }
                });
              } else {
                callback(null, record);
              }
            } else {
              let error: any;
              if (record === null) {
                error = new Error('Unable to add Job to List.');
                callback(error, null);
              } else {
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
    /*
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
     }else {
     if (res.length > 0) {
     let recruiter: Recruiter = new Recruiter();
     recruiter = res[0];
     for (let job of res[0].postedJobs) {
     if (job._id.toString() === item.jobId) {
     let sortBy = 'Experience';
     this.candidateRepository.getCandidateQCard(candidateDetails, job, undefined, sortBy, callback);
     }
     }
     }
     }
     });
     }
     });*/
  }
}

Object.seal(JobProfileService);
export = JobProfileService;
