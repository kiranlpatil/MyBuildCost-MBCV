import * as fs from 'fs';
var config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import IndustryRepository = require("../dataaccess/repository/industry.repository");
import IndustryModel = require("../dataaccess/model/industry.model");
class IndustryService {
  private industryRepository:IndustryRepository;
  APP_NAME:string;

  constructor() {
    this.industryRepository = new IndustryRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieveAll(field:any, callback:(error:any, result:any) => void) {
    this.industryRepository.retrieveAll(field,{  roles :0 }, callback);
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this.industryRepository.retrieve(field,callback);
  }

  findByName(field:any, callback:(error:any, result:any) => void) {
    this.industryRepository.findByName(field,callback);
  }

  create(item:any, callback:(error:any, result:any) => void) {
    this.industryRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error(CNextMessages.MSG_NOT_FOUND_ANY_RECORD_OF_INDUSTRY), null);
      }
      else {
        callback(null, res);
      }
    });
  }
}

Object.seal(IndustryService);
export = IndustryService;
