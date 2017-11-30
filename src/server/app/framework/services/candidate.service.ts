import * as mongoose from "mongoose";
import {UtilityFunction} from "../uitility/utility-function";
import Messages = require('../shared/messages');
import CandidateRepository = require('../dataaccess/repository/candidate.repository');
import UserRepository = require('../dataaccess/repository/user.repository');
import LocationRepository = require('../dataaccess/repository/location.repository');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import IndustryModel = require('../dataaccess/model/industry.model');
import ScenarioModel = require('../dataaccess/model/scenario.model');
import MatchViewModel = require('../dataaccess/model/match-view.model');
import CandidateClassModel = require('../dataaccess/model/candidate-class.model');
import ICandidate = require('../dataaccess/mongoose/candidate');
import User = require('../dataaccess/mongoose/user');
import CapabilitiesClassModel = require('../dataaccess/model/capabilities-class.model');
import ComplexitiesClassModel = require('../dataaccess/model/complexities-class.model');
import RoleModel = require('../dataaccess/model/role.model');
import CandidateModel = require("../dataaccess/model/candidate.model");
import JobProfileModel = require("../dataaccess/model/jobprofile.model");
import JobProfileRepository = require("../dataaccess/repository/job-profile.repository");
import RecruiterService = require("./recruiter.service");
import RecruiterClassModel = require("../dataaccess/model/recruiterClass.model");
import SendMailService = require('./mailer.service');
import ProjectAsset = require('../shared/projectasset');
import {SentMessageInfo} from 'nodemailer';

let bcrypt = require('bcrypt');

class CandidateService {
  private candidateRepository: CandidateRepository;
  private recruiterRepository: RecruiterRepository;
  private industryRepositiry: IndustryRepository;
  private userRepository: UserRepository;
  private locationRepository: LocationRepository;
  private jobProfileRepository: JobProfileRepository;


  constructor() {
    this.candidateRepository = new CandidateRepository();
    this.userRepository = new UserRepository();
    this.recruiterRepository = new RecruiterRepository();
    this.locationRepository = new LocationRepository();
    this.industryRepositiry = new IndustryRepository();
    this.jobProfileRepository = new JobProfileRepository();
  }

  createUser(item: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve({$or: [{'email': item.email}, {'mobile_number': item.mobile_number}]}, (err, res) => {
      if (err) {
        callback(new Error(err), null);
      } else if (res.length > 0) {
        if (res[0].isActivated === true) {
          if (res[0].email === item.email) {
            callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
          }
          if (res[0].mobile_number === item.mobile_number) {
            callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
          }
        } else if (res[0].isActivated === false) {
          callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
        }
      } else {
        const saltRounds = 10;
        bcrypt.hash(item.password, saltRounds, (err: any, hash: any) => {
          // Store hash in your password DB.
          if (err) {
            callback(err, null);
          } else {
            item.password = hash;
            item.isCandidate = true;
            this.userRepository.create(item, (err, res) => {
              if (err) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
              } else {
                let userId1 = res._id;
                let newItem: any = {
                  userId: userId1,
                  location: item.location
                };
                this.candidateRepository.create(newItem, (err: any, res: any) => {
                  if (err) {
                    callback(err, null);
                  } else {
                    if (item.recruiterReferenceId) {
                      this.updateCandidateList(res._doc._id, item, (err: Error, status: string) => {
                       callback(err, res);
                      });
                    } else {
                      callback(null, res);
                    }

                  }
                });
              }
            });
          }
        });
      }
    });
  }

  updateCandidateList(candidateId: number, candidate: any, callback: (error: Error, status: string) => void) {
    let updateQuery = {
      $push: {
        'candidate_list': new mongoose.Types.ObjectId(candidateId)
      }
    };

    let searchQuery = {
      '_id': new mongoose.Types.ObjectId(candidate.recruiterReferenceId)
    };

    this.recruiterRepository.findOneAndUpdate(searchQuery, updateQuery, {},
      (error: Error, recruiter: RecruiterClassModel) => {

        if (error) {
          callback(error, null);
        } else {

          this.recruiterRepository.retrieve({'_id': new mongoose.Types.ObjectId(candidate.recruiterReferenceId)},
            (recruiterErr, recData) => {

              if (recruiterErr) {
                callback(recruiterErr, null);
              } else {
                this.userRepository.retrieve({'_id': new mongoose.Types.ObjectId(recData[0].userId)},
                  (userError, userData) => {

                  if (userError) {
                    callback(userError, null);
                  } else {
                    let sendMailService = new SendMailService();
                    let data: Map<string,string> = new Map([['$first_name$', candidate.first_name],
                      ['$app_name$', ProjectAsset.APP_NAME]]);
                    sendMailService.send(userData[0].email,
                      Messages.EMAIL_SUBJECT_CANDIDATE_REGISTRATION,
                      'new-candidate-registration.html', data, (err: Error) => {
                        if (error) {
                          callback(error, null);
                        } else {
                          callback(null, "success");
                        }
                      });
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
      } else {
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

  retrieveAll(item: any, callback: (error: any, result: any) => void) {
    this.candidateRepository.retrieve(item, (err, res) => {
      if (err) {
        callback(new Error(Messages.MSG_NO_RECORDS_FOUND), null);
      } else {
        callback(null, res);
      }
    });
  };

  retrieveWithLean(field: any, projection: any, callback: (error: any, result: any) => void) {
    this.candidateRepository.retrieveWithLean(field, projection, callback);
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

            if (item.capability_matrix === undefined) {
              item.capability_matrix = {};
            }
            let new_capability_matrix: any = {};
            item.capability_matrix = this.getCapabilityMatrix(item, industries, new_capability_matrix);
            this.candidateRepository.findOneAndUpdateIndustry({'_id': res[0]._id}, item, {new: true}, callback);
          }
        });
      }
    });
  }

  get(_id: string, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve({'_id': _id}, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        this.candidateRepository.retrieve({'userId': new mongoose.Types.ObjectId(result[0]._id)}, (err, res) => {
          if (err) {
            callback(err, null);
          } else {
            this.industryRepositiry.retrieve({'code': res[0].industry.code}, (error: any, industries: IndustryModel[]) => {
              if (error) {
                callback(error, null);
              } else {
                let response: any = this.getCandidateDetail(res[0], result[0], industries);
                callback(null, response);
              }
            });
          }
        });
      }
    });
  }

  getCandidateDetail(candidate: ICandidate, user: User, industries: IndustryModel[]): CandidateClassModel {
    let customCandidate: CandidateClassModel = new CandidateClassModel();
    customCandidate.personalDetails = user;
    customCandidate.jobTitle = candidate.jobTitle;
    customCandidate.location = candidate.location;
    customCandidate.professionalDetails = candidate.professionalDetails;
    customCandidate.academics = candidate.academics;
    customCandidate.employmentHistory = candidate.employmentHistory;
    customCandidate.certifications = candidate.certifications;
    customCandidate.awards = candidate.awards;
    customCandidate.interestedIndustries = candidate.interestedIndustries;
    customCandidate.proficiencies = candidate.proficiencies;
    customCandidate.aboutMyself = candidate.aboutMyself;
    customCandidate.capabilities = [];
    customCandidate.industry = candidate.industry;
    customCandidate.isSubmitted = candidate.isSubmitted;
    customCandidate.isVisible = candidate.isVisible;
    customCandidate.isCompleted = candidate.isCompleted;
    customCandidate.candidateId = candidate._id;
    customCandidate.capabilities = this.getCapabilitiesBuild(candidate.capability_matrix, candidate.complexity_note_matrix, candidate.industry.roles, industries);

    return customCandidate;
  }

  getCapabilitiesBuild(capability_matrix: any, complexity_note_matrix: any, roles: RoleModel[], industries: IndustryModel[]): CapabilitiesClassModel[] {
    let capabilities: CapabilitiesClassModel[] = new Array(0);

    for (let cap in capability_matrix) {

      for (let role of industries[0].roles) {

        for (let candidateRole of roles) {
          if (candidateRole.code.toString() === role.code.toString()) {
            let defaultComplexityCode = cap.split('_')[0];

            if (role.default_complexities.length > 0) {
              if (defaultComplexityCode.toString() === role.default_complexities[0].code.toString()) {
                let isFound: boolean = false;
                let foundedDefaultCapability: CapabilitiesClassModel;
                for (let c of capabilities) {
                  if (c.code === defaultComplexityCode) {
                    foundedDefaultCapability = c;
                    isFound = true;
                  }
                }
                if (!isFound) {
                  let newCapability: CapabilitiesClassModel = new CapabilitiesClassModel();
                  newCapability.name = role.default_complexities[0].name;
                  newCapability.code = role.default_complexities[0].code;
                  newCapability.sort_order = role.default_complexities[0].sort_order;
                  let newComplexities: ComplexitiesClassModel[] = new Array(0);
                  for (let complexity of role.default_complexities[0].complexities) {
                    let complexityCode = cap.split('_')[1];

                    if (complexityCode === complexity.code) {
                      let newComplexity: ComplexitiesClassModel = new ComplexitiesClassModel();
                      newComplexity.name = complexity.name;
                      newComplexity.sort_order = complexity.sort_order;
                      newComplexity.code = complexity.code;
                      if (complexity_note_matrix && complexity_note_matrix[cap] !== undefined) {
                        newComplexity.note = complexity_note_matrix[cap];
                      }
                      if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                        newComplexity.questionForCandidate = complexity.questionForCandidate;
                      } else {
                        newComplexity.questionForCandidate = complexity.name;
                      }
                      for (let scenario of complexity.scenarios) {
                        if (capability_matrix[cap].toString() === scenario.code) {
                          newComplexity.answer = scenario.name;
                        }
                      }

                      newComplexities.push(newComplexity);
                    }

                  }
                  newComplexities = this.getSortedList(newComplexities, "sort_order");
                  newCapability.complexities = newComplexities;
                  capabilities.push(newCapability);
                } else {
                  let isComFound: boolean = false;
                  let FoundedComplexity: ComplexitiesClassModel;
                  for (let complexity of foundedDefaultCapability.complexities) {
                    if (complexity.code === cap.split('_')[1]) {
                      FoundedComplexity = complexity;
                      isComFound = true;
                    }
                  }
                  if (!isComFound) {
                    let newComplexity: ComplexitiesClassModel = new ComplexitiesClassModel();
                    for (let complexity of role.default_complexities[0].complexities) {
                      let complexityCode = cap.split('_')[1];

                      if (complexityCode === complexity.code) {
                        let newComplexity: ComplexitiesClassModel = new ComplexitiesClassModel();
                        newComplexity.name = complexity.name;
                        newComplexity.sort_order = complexity.sort_order;
                        newComplexity.code = complexity.code;
                        if (complexity_note_matrix && complexity_note_matrix[cap] !== undefined) {
                          newComplexity.note = complexity_note_matrix[cap];
                        }
                        if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                          newComplexity.questionForCandidate = complexity.questionForCandidate;
                        } else {
                          newComplexity.questionForCandidate = complexity.name;
                        }
                        for (let scenario of complexity.scenarios) {
                          if (capability_matrix[cap].toString() === scenario.code) {
                            newComplexity.answer = scenario.name;
                          }
                        }
                        foundedDefaultCapability.complexities = this.getSortedList(foundedDefaultCapability.complexities, "sort_order");
                        foundedDefaultCapability.complexities.push(newComplexity);
                      }

                    }

                  }

                }
                break;
              }
            }

            for (let capability of role.capabilities) {

              let capCode = cap.split('_')[0];
              if (capCode === capability.code) {
                let isFound: boolean = false;
                let foundedCapability: CapabilitiesClassModel;
                for (let c of capabilities) {
                  if (c.code === capCode) {
                    foundedCapability = c;
                    isFound = true;
                  }
                }
                if (!isFound) {
                  let newCapability: CapabilitiesClassModel = new CapabilitiesClassModel();
                  newCapability.name = capability.name;
                  newCapability.code = capability.code;
                  newCapability.sort_order = capability.sort_order;
                  let newComplexities: ComplexitiesClassModel[] = new Array(0);
                  for (let complexity of capability.complexities) {
                    let complexityCode = cap.split('_')[1];

                    if (complexityCode === complexity.code) {
                      let newComplexity: ComplexitiesClassModel = new ComplexitiesClassModel();
                      newComplexity.name = complexity.name;
                      newComplexity.sort_order = complexity.sort_order;
                      newComplexity.code = complexity.code;
                      if (complexity_note_matrix && complexity_note_matrix[cap] !== undefined) {
                        newComplexity.note = complexity_note_matrix[cap];
                      }
                      if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                        newComplexity.questionForCandidate = complexity.questionForCandidate;
                      } else {
                        newComplexity.questionForCandidate = complexity.name;
                      }
                      for (let scenario of complexity.scenarios) {
                        if (capability_matrix[cap].toString() === scenario.code) {
                          newComplexity.answer = scenario.name;
                        }
                      }

                      newComplexities.push(newComplexity);
                    }

                  }
                  newComplexities = this.getSortedList(newComplexities, "sort_order");
                  newCapability.complexities = newComplexities;
                  capabilities.push(newCapability);
                } else {
                  let isComFound: boolean = false;
                  let FoundedComplexity: ComplexitiesClassModel;
                  for (let complexity of foundedCapability.complexities) {
                    if (complexity.code === cap.split('_')[1]) {
                      FoundedComplexity = complexity;
                      isComFound = true;
                    }
                  }
                  if (!isComFound) {
                    let newComplexity: ComplexitiesClassModel = new ComplexitiesClassModel();
                    for (let complexity of capability.complexities) {
                      let complexityCode = cap.split('_')[1];

                      if (complexityCode === complexity.code) {
                        let newComplexity: ComplexitiesClassModel = new ComplexitiesClassModel();
                        newComplexity.name = complexity.name;
                        newComplexity.sort_order = complexity.sort_order;
                        newComplexity.code = complexity.code;
                        if (complexity_note_matrix && complexity_note_matrix[cap] !== undefined) {
                          newComplexity.note = complexity_note_matrix[cap];
                        }
                        if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                          newComplexity.questionForCandidate = complexity.questionForCandidate;
                        } else {
                          newComplexity.questionForCandidate = complexity.name;
                        }
                        for (let scenario of complexity.scenarios) {
                          if (capability_matrix[cap].toString() === scenario.code) {
                            newComplexity.answer = scenario.name;
                          }
                        }
                        foundedCapability.complexities = this.getSortedList(foundedCapability.complexities, "sort_order");
                        foundedCapability.complexities.push(newComplexity);
                      }

                    }

                  }

                }
              }
            }
            break;
          }
        }
      }
    }

    capabilities = this.getSortedList(capabilities, "sort_order");

    return capabilities;
  }

  getSortedList(list: any, field: string): any {

    if (list.length > 0) {
      list = list.sort(function (a: any, b: any) {
        return b[field] - a[field];
      });
    }

    return list;
  }

  getCapabilityValueKeyMatrix(_id: string, callback: (error: any, result: any) => void) {
    this.candidateRepository.findByIdwithExclude(_id, {
      complexity_note_matrix: 1,
      capability_matrix: 1,
      'industry.name': 1
    }, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        console.time('-------get candidateRepository-----');
        this.industryRepositiry.retrieve({'name': res.industry.name}, (error: any, industries: IndustryModel[]) => {
          if (err) {
            callback(err, null);
          } else {
            console.timeEnd('-------get candidateRepository-----');
            let new_capability_matrix: any = this.getCapabilityValueKeyMatrixBuild(res.capability_matrix, industries);
            let capabilityMatrrixWithNotes: any = this.getCapabilityMatrixWithNotes(new_capability_matrix, res.complexity_note_matrix);
            callback(null, new_capability_matrix);
          }
        });
      }
    });
  }

  getCapabilityValueKeyMatrixBuild(capability_matrix: any, industries: any, complexity_musthave_matrix?: any): any {
    let keyValueCapability: any = {};
    for (let cap in capability_matrix) {
      let isFound: boolean = false;
      let match_view: MatchViewModel = new MatchViewModel();
      for (let role of industries[0].roles) {
        for (let capability of role.capabilities) {
          let count_of_complexity = 0;
          for (let complexity of capability.complexities) {
            ++count_of_complexity;
            let custom_code = capability.code + '_' + complexity.code;
            if (custom_code === cap) {
              isFound = true;
              match_view.scenarios = complexity.scenarios.slice();
              let scenarios = complexity.scenarios.filter((sce: ScenarioModel) => {
                sce.code = sce.code.replace('.', '_');
                sce.code = sce.code.replace('.', '_');
                sce.code = sce.code.substr(sce.code.lastIndexOf('_') + 1);
                if (sce.code.substr(sce.code.lastIndexOf('.') + 1) == capability_matrix[cap]) {
                  return true;
                } else {
                  return false;
                }
              });
              match_view.capability_name = capability.name;
              match_view.capability_code = capability.code;
              match_view.total_complexity_in_capability = capability.complexities.length;
              match_view.complexity_number = count_of_complexity;
              match_view.role_name = role.name;
              match_view.code = custom_code;
              switch (role.sort_order.toString().length.toString()) {
                case '1' :
                  match_view.role_sort_order = '000' + role.sort_order;
                  break;
                case '2' :
                  match_view.role_sort_order = '00' + role.sort_order;
                  break;
                case '3' :
                  match_view.role_sort_order = '0' + role.sort_order;
                  break;
                case '4' :
                  match_view.role_sort_order = role.sort_order;
                  break;
                default :
                  match_view.role_sort_order = '0000';
              }
              switch (capability.sort_order.toString().length.toString()) {
                case '1' :
                  match_view.capability_sort_order = '000' + capability.sort_order;
                  break;
                case '2' :
                  match_view.capability_sort_order = '00' + capability.sort_order;
                  break;
                case '3' :
                  match_view.capability_sort_order = '0' + capability.sort_order;
                  break;
                case '4' :
                  match_view.capability_sort_order = capability.sort_order;
                  break;
                default :
                  match_view.capability_sort_order = '0000';
              }
              switch (complexity.sort_order.toString().length.toString()) {
                case '1' :
                  match_view.complexity_sort_order = '000' + complexity.sort_order;
                  break;
                case '2' :
                  match_view.complexity_sort_order = '00' + complexity.sort_order;
                  break;
                case '3' :
                  match_view.complexity_sort_order = '0' + complexity.sort_order;
                  break;
                case '4' :
                  match_view.complexity_sort_order = complexity.sort_order;
                  break;
                default :
                  match_view.complexity_sort_order = '0000';
              }
              match_view.main_sort_order = Number(match_view.role_sort_order + match_view.capability_sort_order + match_view.complexity_sort_order);
              if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                match_view.questionForCandidate = complexity.questionForCandidate;
              } else {
                match_view.questionForCandidate = complexity.name;
              }
              if (complexity.questionForRecruiter !== undefined && complexity.questionForRecruiter !== null && complexity.questionForRecruiter !== '') {
                match_view.questionForRecruiter = complexity.questionForRecruiter;
              } else {
                match_view.questionForRecruiter = complexity.name;
              }
              if (complexity.questionHeaderForCandidate !== undefined && complexity.questionHeaderForCandidate !== null && complexity.questionHeaderForCandidate !== '') {
                match_view.questionHeaderForCandidate = complexity.questionHeaderForCandidate;
              } else {
                match_view.questionHeaderForCandidate = Messages.MSG_HEADER_QUESTION_CANDIDATE;
              }
              if (complexity.questionHeaderForRecruiter !== undefined && complexity.questionHeaderForRecruiter !== null && complexity.questionHeaderForRecruiter !== '') {
                match_view.questionHeaderForRecruiter = complexity.questionHeaderForRecruiter;
              } else {
                match_view.questionHeaderForRecruiter = Messages.MSG_HEADER_QUESTION_RECRUITER;
              }
              match_view.complexity_name = complexity.name;
              if (scenarios[0]) {
                match_view.scenario_name = scenarios[0].name;
                match_view.userChoice = scenarios[0].code;
              }
              if (complexity_musthave_matrix && complexity_musthave_matrix[cap] !== undefined) {
                match_view.complexityIsMustHave = complexity_musthave_matrix[cap];
              }
              keyValueCapability[cap] = match_view;
              break;
            }
          }
          if (isFound) {
            //break;
          }
        }
        if (role.default_complexities) {
          for (let capability of role.default_complexities) {
            let count_of_default_complexity = 0;
            for (let complexity of capability.complexities) {
              ++count_of_default_complexity;
              let custom_code = capability.code + '_' + complexity.code;
              if (custom_code === cap) {
                isFound = true;
                match_view.scenarios = complexity.scenarios.slice();
                let scenarios = complexity.scenarios.filter((sce: ScenarioModel) => {
                  sce.code = sce.code.replace('.', '_');
                  sce.code = sce.code.replace('.', '_');
                  sce.code = sce.code.substr(sce.code.lastIndexOf('_') + 1);
                  if (sce.code.substr(sce.code.lastIndexOf('.') + 1) == capability_matrix[cap]) {
                    return true;
                  } else {
                    return false;
                  }
                });
                match_view.capability_name = capability.name;
                match_view.capability_code = capability.code;
                match_view.total_complexity_in_capability = capability.complexities.length;
                match_view.complexity_number = count_of_default_complexity;
                match_view.complexity_name = complexity.name;
                match_view.role_name = role.name;
                match_view.code = custom_code;
                switch (role.sort_order.toString().length.toString()) {
                  case '1' :
                    match_view.role_sort_order = '000' + role.sort_order;
                    break;
                  case '2' :
                    match_view.role_sort_order = '00' + role.sort_order;
                    break;
                  case '3' :
                    match_view.role_sort_order = '0' + role.sort_order;
                    break;
                  case '4' :
                    match_view.role_sort_order = role.sort_order;
                    break;
                  default :
                    match_view.role_sort_order = '0000';
                }
                switch (capability.sort_order.toString().length.toString()) {
                  case '1' :
                    match_view.capability_sort_order = '000' + capability.sort_order;
                    break;
                  case '2' :
                    match_view.capability_sort_order = '00' + capability.sort_order;
                    break;
                  case '3' :
                    match_view.capability_sort_order = '0' + capability.sort_order;
                    break;
                  case '4' :
                    match_view.capability_sort_order = capability.sort_order;
                    break;
                  default :
                    match_view.capability_sort_order = '0000';
                }
                switch (complexity.sort_order.toString().length.toString()) {
                  case '1' :
                    match_view.complexity_sort_order = '000' + complexity.sort_order;
                    break;
                  case '2' :
                    match_view.complexity_sort_order = '00' + complexity.sort_order;
                    break;
                  case '3' :
                    match_view.complexity_sort_order = '0' + complexity.sort_order;
                    break;
                  case '4' :
                    match_view.complexity_sort_order = complexity.sort_order;
                    break;
                  default :
                    match_view.complexity_sort_order = '0000';
                }
                match_view.main_sort_order = Number(match_view.role_sort_order + match_view.capability_sort_order + match_view.complexity_sort_order);
                if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                  match_view.questionForCandidate = complexity.questionForCandidate;
                } else {
                  match_view.questionForCandidate = complexity.name;
                }
                if (complexity.questionForRecruiter !== undefined && complexity.questionForRecruiter !== null && complexity.questionForRecruiter !== '') {
                  match_view.questionForRecruiter = complexity.questionForRecruiter;
                } else {
                  match_view.questionForRecruiter = complexity.name;
                }
                if (complexity.questionHeaderForCandidate !== undefined && complexity.questionHeaderForCandidate !== null && complexity.questionHeaderForCandidate !== '') {
                  match_view.questionHeaderForCandidate = complexity.questionHeaderForCandidate;
                } else {
                  match_view.questionHeaderForCandidate = Messages.MSG_HEADER_QUESTION_CANDIDATE;
                }
                if (complexity.questionHeaderForRecruiter !== undefined && complexity.questionHeaderForRecruiter !== null && complexity.questionHeaderForRecruiter !== '') {
                  match_view.questionHeaderForRecruiter = complexity.questionHeaderForRecruiter;
                } else {
                  match_view.questionHeaderForRecruiter = Messages.MSG_HEADER_QUESTION_RECRUITER;
                }
                if (scenarios[0]) {
                  match_view.scenario_name = scenarios[0].name;
                  match_view.userChoice = scenarios[0].code;
                }
                if (complexity_musthave_matrix && complexity_musthave_matrix[cap] !== undefined) {
                  match_view.complexityIsMustHave = complexity_musthave_matrix[cap];
                }
                keyValueCapability[cap] = match_view;
                break;
              }
            }
            if (isFound) {
              //break;
            }
          }
        }
        if (isFound) {
          //break;
        }
      }
    }
    let orderKeys = function (o: any, f: any) {
      let os: any = [], ks: any = [], i: any;
      for (let i in o) {
        os.push([i, o[i]]);
      }
      os.sort(function (a: any, b: any) {
        return f(a[1], b[1]);
      });
      for (i = 0; i < os.length; i++) {
        ks.push(os[i][0]);
      }
      return ks;
    };

    let result = orderKeys(keyValueCapability, function (a: any, b: any) {
      return a.main_sort_order - b.main_sort_order;
    }); // => ["Elem4", "Elem2", "Elem1", "Elem3"]
    let responseToReturn: any = {};
    for (let i of result) {
      responseToReturn[i] = keyValueCapability[i];
    }
    return responseToReturn;
  }

  getCapabilityMatrix(item: any, industries: IndustryModel[], new_capability_matrix: any): any {
    if (item.industry.roles && item.industry.roles.length > 0) {
      for (let role of item.industry.roles) {
        if (role.default_complexities) {
          for (let capability of  role.default_complexities) {
            if (capability.code) {
              for (let mainRole of industries[0].roles) {
                if (role.code.toString() === mainRole.code.toString()) {
                  for (let mainCap of mainRole.default_complexities) {
                    if (capability.code.toString() === mainCap.code.toString()) {
                      for (let mainComp of mainCap.complexities) {
                        let itemcode = mainCap.code + '_' + mainComp.code;
                        if (item.capability_matrix[itemcode] === undefined) {
                          if (new_capability_matrix != undefined && new_capability_matrix[itemcode] == undefined) {
                            new_capability_matrix[itemcode] = -1;
                            item.capability_matrix[itemcode] = -1;
                          }
                        } else if (item.capability_matrix[itemcode] !== -1) {
                          if (new_capability_matrix != undefined && new_capability_matrix[itemcode] == undefined) {
                            new_capability_matrix[itemcode] = item.capability_matrix[itemcode];
                          }
                        } else {
                          if (new_capability_matrix != undefined && new_capability_matrix[itemcode] == undefined) {
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

        if (role.capabilities && role.capabilities.length > 0) {
          for (let capability of role.capabilities) {
            if (capability.code) {
              for (let mainRole of industries[0].roles) {
                if (role.code.toString() === mainRole.code.toString()) {
                  for (let mainCap of mainRole.capabilities) {
                    if (capability.code.toString() === mainCap.code.toString()) {
                      for (let mainComp of mainCap.complexities) {
                        let itemcode = mainCap.code + '_' + mainComp.code;
                        if (item.capability_matrix[itemcode] === undefined) {
                          new_capability_matrix[itemcode] = -1;
                          item.capability_matrix[itemcode] = -1;
                        } else if (item.capability_matrix !== -1) {
                          new_capability_matrix[itemcode] = item.capability_matrix[itemcode];
                        } else {
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
    }
    return new_capability_matrix;
  }

  getList(item: any, callback: (error: any, result: any) => void) {
    console.log('get');
  }

  loadCapabilitiDetails(capabilityMatrix: any) {
    let capabilityMatrixKeys: string [] = Object.keys(capabilityMatrix);
    let capabilitiesArray: any [] = new Array();
    for (let keys of capabilityMatrixKeys) {
      let keyArray = keys.split('_');
      let capabilityObject = {
        'capabilityCode': keyArray[0],
        'complexityCode': keyArray[1],
        'scenerioCode': capabilityMatrix[keys]
      };
      capabilitiesArray.push(capabilityObject);
    }
    return capabilitiesArray;
  }

  loadRoles(roles: any[]) {
    //let selectedRoles : string[] = new Array();
    let selectedRoles: string = '';
    for (let role of roles) {
      selectedRoles = selectedRoles + ' $' + role.name;
      //selectedRoles.push(role.name);
    }
    return selectedRoles;
  }

  getTotalCandidateCount(callback: (error: any, result: any) => void) {
    let query = {};
    this.candidateRepository.getCount(query, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(err, result);
      }
    });
  }

  getCapabilityMatrixWithNotes(capability_matrix: any, complexity_note_matrix: any) {
    if (complexity_note_matrix) {
      for (let cap in complexity_note_matrix) {
        if (capability_matrix[cap]) {
          capability_matrix[cap].complexityNote = complexity_note_matrix[cap];
        }
      }
    }
    return capability_matrix;
  }


  updateField(_id: string, item: any, callback: (error: any, result: any) => void) {
    this.candidateRepository.updateByUserId(new mongoose.Types.ObjectId(_id), item, callback);
  }

  /*isCandidateInCart(candidateDetails:CandidateClassModel, jobProfiles:JobProfileModel[]): boolean {
   let isInCart = false;
   for (let job of jobProfiles) {
   for (let item of job.candidate_list) {
   if (item.name === 'cartListed') {
   if (item.ids.indexOf(new mongoose.Types.ObjectId(candidateDetails.candidateId).toString()) !== -1) {
   isInCart = true;
   break;
   }
   }
   }
   if (isInCart) {
   break;
   }
   }
   return isInCart;
   }*/

  checkIsCarted(candidateUserId: string, recruiterUserId: string, callback: (error: any, result: any) => void) {
    this.get(candidateUserId, (err, candidateDetails) => {
      if (err) {
        callback(err, null);
      } else {
        this.recruiterRepository.retrieve({'userId': recruiterUserId}, (err, recruiterDetails) => {
          if (err) {
            callback(err, null);
          } else {
            this.jobProfileRepository.retrieve({'recruiterId': recruiterDetails[0]._id}, (error: any, jobs: any[]) => {
              if (error) {
                callback(error, null);
              }
              let isInCart = false;
              for (let job of jobs) {
                for (let item of job.candidate_list) {
                  if (item.name === 'cartListed') {
                    if (item.ids.indexOf(new mongoose.Types.ObjectId(candidateDetails.candidateId).toString()) !== -1) {
                      isInCart = true;
                      break;
                    }
                  }
                }
                if (isInCart) {
                  break;
                }
              }
              callback(err, isInCart);
            });

          }
        });
      }
    });
  }


  maskCandidateDetails(candidateUserId: string, recruiterUserId: string, callback: (error: any, result: any) => void) {
    this.get(candidateUserId, (err, candidateDetails) => {
      if (err) {
        callback(err, null);
      } else {
        let isInCart: boolean;
        this.checkIsCarted(candidateUserId, recruiterUserId, (err, isCarted) => {
          if (err) {
            callback(err, null);
          } else {
            isInCart = isCarted;
            console.log('isInCart', isCarted);
            if (!isCarted) {
              candidateDetails.personalDetails.last_name = UtilityFunction.valueHide(candidateDetails.personalDetails.last_name);
              candidateDetails.personalDetails.email = UtilityFunction.emailValueHider(candidateDetails.personalDetails.email);
              candidateDetails.personalDetails.mobile_number = UtilityFunction.mobileNumberHider(candidateDetails.personalDetails.mobile_number);
              candidateDetails.isInCart = isCarted;
            }
            callback(err, candidateDetails);
          }
        });
      }
    });
  }

  notifyCandidateOnCartAddition(candidateId: string, recruiterId: string, jobTitle: string,
                                callback: (error: Error, result: SentMessageInfo) => void) {
    this.recruiterRepository.getRecruiterData(recruiterId, (error, recruiter) => {
      if (error) {
        callback(error, null);
        return;
      }
      this.candidateRepository.populateCandidateDetails(candidateId, (err, candidate) => {
        if (err) {
          callback(err, null);
          return;
        }
        let config = require('config');
        let sendMailService = new SendMailService();
        let data: Map<string, string> = new Map([['$link$', config.get('TplSeed.mail.host') + 'signin'],
          ['$firstname$', candidate.first_name],
          ['$jobtitle$', jobTitle], ['$recruiter$', recruiter[0].company_name]]);
        sendMailService.send('luckyvaishnav55@gmail.com',
          Messages.EMAIL_SUBJECT_CANDIDATE_ADDED_TO_CART,
          'candidate-added-to-cart.html', data, callback);
      });
    });
  }

  sendMailToRecruiter(candidate: any, callback: (error: any, result: any) => void) {

    this.recruiterRepository.retrieve({'_id': new mongoose.Types.ObjectId(candidate.recruiterReferenceId)}, (recruiterErr, recData) => {
      if (recruiterErr) {
        callback(recruiterErr, null);
      } else {

        this.userRepository.retrieve({'_id': new mongoose.Types.ObjectId(recData[0].userId)}, (userError, userData) => {
          if (userError) {
            callback(userError, null);
          } else {
            let sendMailService = new SendMailService();
            let data: Map<string, string> = new Map([['$first_name$', candidate.basicInformation.first_name],
              ['$app_name$', ProjectAsset.APP_NAME]]);
            sendMailService.send(userData[0].email,
              Messages.EMAIL_SUBJECT_CANDIDATE_REGISTRATION,
              'candidate-profile-completed.html', data, (err: Error) => {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, "success");
                }
              });
          }
        });
      }
    });
  }
}

Object.seal(CandidateService);
export = CandidateService;
