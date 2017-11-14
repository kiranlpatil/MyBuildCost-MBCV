import CapabilityClassModel = require("../dataaccess/model/capability-class.model");
let config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import CapabilityRepository = require("../dataaccess/repository/capability.repository");
import IndustryRepository = require("../dataaccess/repository/industry.repository");
class CapabilityService {
  private capabilityRepository: CapabilityRepository;
  private industryRepository: IndustryRepository;
  APP_NAME: string;

  constructor() {
    this.capabilityRepository = new CapabilityRepository();
    this.industryRepository = new IndustryRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.capabilityRepository.retrieveAll({}, callback);
  }

  create(item: any, callback: (error: any, result: any) => void) {
    this.capabilityRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error("Problem in Creating capability model"), null);
      }
      else {
        callback(null, res);
      }
    });
  }

  retrieveByMultiIds(item: any, callback: (error: any, result: any) => void) {
    this.capabilityRepository.retrieveByMultiIds(item, {'complexities': 0}, callback);
  }

  retrieveByMultiidsWithComplexity(item: any, names: any, callback: (error: any, result: any) => void) {
    this.capabilityRepository.retrieveByMultiIdsAndNames(item, names, {_id: 0}, callback);
  }

  findByName(field: any, callback: (error: any, result: any) => void) {
    this.industryRepository.findCapabilities(field, callback);
  }

  addCapabilities(currentRow:any, capabilities:any) {
    if (capabilities.length != 0) {
      let isCapabilityFound : boolean = false;
      for (let i = 0; i < capabilities.length; i++) {
        if (currentRow.capability == capabilities[i].name) {
          isCapabilityFound = true;

        }
      }
      if (!isCapabilityFound) {
        let newCapability = new CapabilityClassModel(currentRow.capability, currentRow.capability_code, currentRow.capability_display_sequence);
        if (currentRow['default_capability_for_aow'] == 'D') {
          newCapability.code = 'd' + newCapability.code;
        }
        capabilities.push(newCapability);
      }
      return capabilities;
    }else {
      let newCapability = new CapabilityClassModel(currentRow.capability, currentRow.capability_code, currentRow.capability_display_sequence);
      if (currentRow['default_capability_for_aow'] == 'D') {
        newCapability.code = 'd' + newCapability.code;
      }
      capabilities.push(newCapability);
      return capabilities;
    }
  }
}

Object.seal(CapabilityService);
export = CapabilityService;
