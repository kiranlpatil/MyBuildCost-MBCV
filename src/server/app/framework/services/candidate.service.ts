import * as mongoose from "mongoose";
import Messages = require('../shared/messages');
import ProjectAsset = require('../shared/projectasset');
import CandidateRepository = require('../dataaccess/repository/candidate.repository');
import UserRepository = require('../dataaccess/repository/user.repository');
import LocationRepository = require('../dataaccess/repository/location.repository');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import IndustryModel = require("../dataaccess/model/industry.model");
import ScenarioModel = require("../dataaccess/model/scenario.model");
import MatchViewModel = require("../dataaccess/model/match-view.model");
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
          }else {
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
      }else {
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
        this.industryRepositiry.retrieve({'name': item.industry.name}, (error: any, industries: IndustryModel[]) => {
          if (err) {
            callback(err, res);
          } else {

            if(item.capability_matrix === undefined) {
              item.capability_matrix = { };
            }
            let new_capability_matrix: any = { };
           item.capability_matrix = this.getCapabilityMatrix(item,industries,new_capability_matrix);
            this.candidateRepository.findOneAndUpdateIndustry({'_id': res[0]._id}, item, {new: true}, callback);
          }
        });
      }
    });
  }

  getCapabilityValueKeyMatrix(_id: string,  callback: (error: any, result: any) => void) {

    this.candidateRepository.retrieve({'_id': new mongoose.Types.ObjectId(_id)}, (err, res) => {
      if (err) {
        callback(err, res);
      } else {
        this.industryRepositiry.retrieve({'name': res[0].industry.name}, (error: any, industries: IndustryModel[]) => {
          if (err) {
            callback(err, res);
          } else {

            let new_capability_matrix: any =  this.getCapabilityValueKeyMatrixBuild(res[0].capability_matrix,industries);
            callback(null, new_capability_matrix);
          }
        });
      }
    });
  }


  getCapabilityValueKeyMatrixBuild(capability_matrix : any, industries : any) : any {
    let keyValueCapability : any = { };
    for (let cap in capability_matrix) {
      let isFound: boolean = false;
      let match_view: MatchViewModel = new MatchViewModel();
      for (let role of industries[0].roles) {
        for (let capability of role.capabilities) {
          for (let complexity of capability.complexities) {
            let custom_code = capability.code + '_' + complexity.code;
            if (custom_code === cap) {
              isFound = true;
              match_view.scenarios = complexity.scenarios.slice();
              let scenarios = complexity.scenarios.filter((sce: ScenarioModel) => {
                sce.code = sce.code.replace('.', '_');
                sce.code = sce.code.replace('.', '_');
                sce.code = sce.code.substr(sce.code.lastIndexOf('_') + 1);
                if (sce.code.substr(sce.code.lastIndexOf('.')+1) == capability_matrix[cap]) {
                  return true;
                } else {
                  return false;
                }
              });
              match_view.capability_name = capability.name;
              match_view.role_name = role.name;
              match_view.code = custom_code;
              if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                match_view.questionForCandidate = complexity.questionForCandidate;
              } else {
                match_view.questionForCandidate = complexity.name;
              }
              if (complexity.questionForRecruiter !== undefined && complexity.questionForRecruiter !== null && complexity.questionForRecruiter !== '') {
                match_view.questionForRecruiter = complexity.questionForCandidate;
              } else {
                match_view.questionForRecruiter = complexity.name;
              }
              match_view.complexity_name = complexity.name;
              if (scenarios[0]) {
                match_view.scenario_name = scenarios[0].name;
                match_view.userChoice = scenarios[0].code;
              }
              keyValueCapability[cap]=match_view;
              break;
            }
          }
          if (isFound) {
            break;
          }
        }
        for (let capability of role.default_complexities) {
          for (let complexity of capability.complexities) {
            let custom_code = capability.code + '_' + complexity.code;
            if (custom_code === cap) {
              isFound = true;
              match_view.scenarios = complexity.scenarios.slice();
              let scenarios = complexity.scenarios.filter((sce: ScenarioModel) => {
                sce.code = sce.code.replace('.', '_');
                sce.code = sce.code.replace('.', '_');
                sce.code = sce.code.substr(sce.code.lastIndexOf('_') + 1);
                if (sce.code.substr(sce.code.lastIndexOf('.')+1) == capability_matrix[cap]) {
                  return true;
                } else {
                  return false;
                }
              });
              match_view.capability_name = capability.name;
              match_view.complexity_name = complexity.name;
              match_view.role_name = role.name;
              match_view.code = custom_code;
              if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                match_view.questionForCandidate = complexity.questionForCandidate;
              } else {
                match_view.questionForCandidate = complexity.name;
              }
              if (complexity.questionForRecruiter !== undefined && complexity.questionForRecruiter !== null && complexity.questionForRecruiter !== '') {
                match_view.questionForRecruiter = complexity.questionForCandidate;
              } else {
                match_view.questionForRecruiter = complexity.name;
              }
              if(scenarios[0]){
                match_view.scenario_name = scenarios[0].name;
                match_view.userChoice = scenarios[0].code;
              }
              keyValueCapability[cap]=match_view;
              break;
            }
          }
          if (isFound) {
            break;
          }
        }
        if (isFound) {
          break;
        }
      }
    }
    return keyValueCapability;
  }


  getCapabilityMatrix(item : any,industries: IndustryModel[], new_capability_matrix: any ) : any {
    if (item.industry.roles && item.industry.roles.length > 0) {
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
                      }else if(item.capability_matrix[itemcode] !== -1) {
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
    return new_capability_matrix;
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
