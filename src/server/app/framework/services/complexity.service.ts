import * as fs from 'fs';
var config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import ComplexityRepository = require("../dataaccess/repository/complexity.repository");
import IndustryRepository = require("../dataaccess/repository/industry.repository");
class ComplexityService {
  private complexityRepository:ComplexityRepository;
  private industryRepository:IndustryRepository;

  APP_NAME:string;

  constructor() {
    this.complexityRepository = new ComplexityRepository();
    this.industryRepository = new IndustryRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this.complexityRepository.retrieveAll(field,{}, callback);
  }

  create(item:any, callback:(error:any, result:any) => void) {
    this.complexityRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error("Problem in Creating Complexity model"), null);
      }
      else {
        callback(null, res);
      }
    });
  }

  retrieveByMultiIds(item:any, callback:(error:any, result:any) => void) {
    this.complexityRepository.retrieveByMultiIds(item,{  _id: 0 }, callback);
  }


  findByName(field:any, callback:(error:any, result:any) => void) {
    this.industryRepository.findComplexities(field,callback);
  }

}

Object.seal(ComplexityService);
export = ComplexityService;
