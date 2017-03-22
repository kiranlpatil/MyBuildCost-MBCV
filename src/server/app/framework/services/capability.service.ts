import * as fs from 'fs';
var config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import CapabilityRepository = require("../dataaccess/repository/capability.repository");
class CapabilityService {
  private capabilityRepository:CapabilityRepository;
  APP_NAME:string;

  constructor() {
    this.capabilityRepository = new CapabilityRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this.capabilityRepository.retrieveAll(field, callback);
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
    this.capabilityRepository.retrieveByMultiIds(item,{  _id: 0,'complexities':0  }, callback);
  }

}

Object.seal(CapabilityService);
export = CapabilityService;
