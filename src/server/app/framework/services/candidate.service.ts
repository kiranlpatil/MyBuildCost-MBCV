import * as mongoose from 'mongoose';
import Messages = require('../shared/messages');
import ProjectAsset = require('../shared/projectasset');
import CandidateRepository = require('../dataaccess/repository/candidate.repository');
import UserRepository = require('../dataaccess/repository/user.repository');
import LocationRepository = require('../dataaccess/repository/location.repository');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import IndustryModel = require("../dataaccess/model/industry.model");
import ScenarioModel = require("../dataaccess/model/scenario.model");
class CandidateService {
  private candidateRepository: CandidateRepository;
  private recruiterRepository: RecruiterRepository;
  private industryRepositiry: IndustryRepository;
  private userRepository: UserRepository;
  private locationRepository: LocationRepository;

  APP_NAME: string;

  constructor() {
    this.candidateRepository = new CandidateRepository();
    this.userRepository = new UserRepository();
    this.recruiterRepository = new RecruiterRepository();
    this.locationRepository = new LocationRepository();
    this.industryRepositiry = new IndustryRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  createUser(item: any, callback: (error: any, result: any) => void) {
    console.log('USer is', item);
    this.userRepository.retrieve({'email': item.email}, (err, res) => {
      if (err) {
        callback(new Error(err), null);
      }
      else if (res.length > 0) {
        if (res[0].isActivated === true) {
          callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
        } else if (res[0].isActivated === false) {
          callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
        }
      }
      else {
        item.isCandidate = true;
        this.userRepository.create(item, (err, res) => {
          if (err) {
            callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
          }
          else {
            var userId1 = res._id;
            var newItem: any = {
              userId: userId1,
              location: item.location
            };
            this.candidateRepository.create(newItem, (err: any, res: any) => {
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

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.candidateRepository.retrieve(field, (err, result) => {
      if (err) {
        callback(err, null);
      }
      else {
        if (result.length > 0) {
          result[0].academics = result[0].academics.sort(function (a: any, b: any) {
            return b.yearOfPassing - a.yearOfPassing;
          });
          result[0].awards = result[0].awards.sort(function (a: any, b: any) {
            return b.year - a.year;
          });
          result[0].certifications = result[0].certifications.sort(function (a: any, b: any) {
            return b.year - a.year;
          });

          callback(null, result);
        }
      }
    });
  }

  findById(id: any, callback: (error: any, result: any) => void) {
    this.candidateRepository.findById(id, callback);
  }

  update(_id: string, item: any, callback: (error: any, result: any) => void) {

    this.candidateRepository.retrieve({'userId': new mongoose.Types.ObjectId(_id)}, (err, res) => {
      if (err) {
        callback(err, res);
      } else {
        this.industryRepositiry.retrieve({"name": item.industry.name}, (error: any, industries: IndustryModel[]) => {
          if (err) {
            callback(err, res);
          } else {
            if(item.capability_matrix === undefined) {
              item.capability_matrix = { };
            }
            if (item.industry.roles && item.industry.roles.length > 0) {
              for (let role of item.industry.roles) {
                if (role.capabilities && role.capabilities.length > 0) {
                  for (let capability of role.capabilities) {
                    if (capability.code) {
                      for (let mainRole of industries[0].roles) {
                        if (role.code.toString() == mainRole.code) {
                          for (let mainCap of mainRole.capabilities) {
                            if (capability.code.toString() == mainCap.code) {
                              for (let mainComp of mainCap.complexities) {
                                let itemcode = mainCap.code +'_' + mainComp.code;
                                if (item.capability_matrix[itemcode] === undefined) {
                                  item.capability_matrix[itemcode] = -1;
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
                      if (role.code.toString() == mainRole.code) {
                         for (let mainCap of mainRole.default_complexities) {
                          if (capability.code.toString() == mainCap.code) {
                            for (let mainComp of mainCap.complexities) {
                              let itemcode = mainCap.code +'_'+ mainComp.code;
                              if (item.capability_matrix[itemcode] === undefined) {
                                item.capability_matrix[itemcode] = -1;
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
            this.candidateRepository.findOneAndUpdateIndustry({'_id': res[0]._id}, item, {new: true}, callback);
          }
        });
      }
    });
  }

  getList(item: any, callback: (error: any, result: any) => void) {
    let query = {
      'postedJobs._id': {$in: item.ids},
    };
    this.recruiterRepository.retrieve(query, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        this.recruiterRepository.getJobProfileQCard(res, item.candidate, item.ids, (canError, canResult) => {
          if (canError) {
            callback(canError, null);
          } else {
            callback(null, canResult);
          }
        });
      }
    });
  }

}

Object.seal(CandidateService);
export = CandidateService;
