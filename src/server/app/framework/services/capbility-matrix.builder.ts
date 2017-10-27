import Messages = require('../shared/messages');
import ProjectAsset = require('../shared/projectasset');
import CandidateRepository = require('../dataaccess/repository/candidate.repository');
import UserRepository = require('../dataaccess/repository/user.repository');
import LocationRepository = require('../dataaccess/repository/location.repository');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import IndustryModel = require("../dataaccess/model/industry.model");
class CapabilityMatrixService {
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

  getCapabilityMatrix(item: any, industries: IndustryModel[], new_capability_matrix: any): any {
    console.log(item);
    console.log(industries);
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
                        let itemcode = mainCap.code + '_' + mainComp.code;
                        if (item.capability_matrix && item.capability_matrix[itemcode] === undefined) {
                          new_capability_matrix[itemcode] = -1;
                          item.capability_matrix[itemcode] = -1;
                        } else if (item.capability_matrix && item.capability_matrix[itemcode] !== -1) {
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
        if (role.default_complexities) {
          for (let capability of  role.default_complexities) {
            if (capability.code) {
              for (let mainRole of industries[0].roles) {
                if (role.code.toString() === mainRole.code.toString()) {
                  for (let mainCap of mainRole.default_complexities) {
                    if (capability.code.toString() === mainCap.code.toString()) {
                      for (let mainComp of mainCap.complexities) {
                        let itemcode = mainCap.code + '_' + mainComp.code;
                        if (item.capability_matrix && item.capability_matrix[itemcode] === undefined) {
                          new_capability_matrix[itemcode] = -1;
                          item.capability_matrix[itemcode] = -1;
                        } else if (item.capability_matrix && item.capability_matrix[itemcode] !== -1) {
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

  //getComplexityMustHaveMatrix
  getComplexityMustHaveMatrix(item: any, industries: IndustryModel[], new_complexity_musthave_matrix: any): any {
    console.log(item);
    console.log(industries);
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
                        let itemcode = mainCap.code + '_' + mainComp.code;
                        if (item.complexity_musthave_matrix && item.complexity_musthave_matrix[itemcode] === undefined) {
                          new_complexity_musthave_matrix[itemcode] = false;
                          item.complexity_musthave_matrix[itemcode] = false;
                        } else if (item.complexity_musthave_matrix && item.complexity_musthave_matrix[itemcode] !== false) {
                          new_complexity_musthave_matrix[itemcode] = item.complexity_musthave_matrix[itemcode];
                        } else {
                          new_complexity_musthave_matrix[itemcode] = false;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (role.default_complexities) {
          for (let capability of  role.default_complexities) {
            if (capability.code) {
              for (let mainRole of industries[0].roles) {
                if (role.code.toString() === mainRole.code.toString()) {
                  for (let mainCap of mainRole.default_complexities) {
                    if (capability.code.toString() === mainCap.code.toString()) {
                      for (let mainComp of mainCap.complexities) {
                        let itemcode = mainCap.code + '_' + mainComp.code;
                        if (item.complexity_musthave_matrix && item.complexity_musthave_matrix[itemcode] === undefined) {
                          new_complexity_musthave_matrix[itemcode] = false;
                          item.complexity_musthave_matrix[itemcode] = false;
                        } else if (item.complexity_musthave_matrix && item.complexity_musthave_matrix[itemcode] !== false) {
                          new_complexity_musthave_matrix[itemcode] = item.complexity_musthave_matrix[itemcode];
                        } else {
                          new_complexity_musthave_matrix[itemcode] = false;
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
    return new_complexity_musthave_matrix;
  }
}

Object.seal(CapabilityMatrixService);
export = CapabilityMatrixService;
