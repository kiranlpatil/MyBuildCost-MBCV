import * as fs from 'fs';
var config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import ProficiencyRepository = require("../dataaccess/repository/proficiency.repository");
class ProficiencyService {
  private proficiencyRepository:ProficiencyRepository;
  APP_NAME:string;

  constructor() {
    this.proficiencyRepository = new ProficiencyRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this.proficiencyRepository.retrieve(field,callback);
  }

  pushIntoArray(name:any, value:string,callback:(error:any, result:any) => void) {
    this.proficiencyRepository.pushElementInArray(name,value,callback);
  }

  create(item:any, callback:(error:any, result:any) => void) {
    this.proficiencyRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error(CNextMessages.PROBLEM_IN_CREATING_INDUSTRY), null);
      }
      else {
        callback(null, res);
      }
    });
  }
}

Object.seal(ProficiencyService);
export = ProficiencyService;
