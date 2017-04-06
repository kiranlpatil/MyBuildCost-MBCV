import * as fs from 'fs';
var config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import CapabilityRepository = require("../dataaccess/repository/capability.repository");
import IndustryRepository = require("../dataaccess/repository/industry.repository");
class CapabilityService {
  private capabilityRepository:CapabilityRepository;
  private industryRepository : IndustryRepository;
  APP_NAME:string;

  constructor() {
    this.capabilityRepository = new CapabilityRepository();
    this.industryRepository = new IndustryRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this.capabilityRepository.retrieveAll(field,{}, callback);
  }

  create(item:any, callback:(error:any, result:any) => void) {
    this.capabilityRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error("Problem in Creating capability model"), null);
      }
      else {
        callback(null, res);
      }
    });
  }

  retrieveByMultiIds(item:any, callback:(error:any, result:any) => void) {
    this.capabilityRepository.retrieveByMultiIds(item,{  'complexities':0  }, callback);
  }

  retrieveByMultiidsWithComplexity(item:any,names:any, callback:(error:any, result:any) => void) {
    this.capabilityRepository.retrieveByMultiIdsAndNames(item,names,{  _id: 0  }, callback);
  }

  findByName(field:any, callback:(error:any, result:any) => void) {
    this.industryRepository.findCapabilities(field,callback);
  }

}

Object.seal(CapabilityService);
export = CapabilityService;
