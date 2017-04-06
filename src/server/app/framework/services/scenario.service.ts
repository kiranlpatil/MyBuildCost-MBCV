import * as fs from 'fs';
var config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import ScenarioRepository = require("../dataaccess/repository/scenario.repository");
class ScenarioService {
  private scenarioRepository:ScenarioRepository;
  APP_NAME:string;

  constructor() {
    this.scenarioRepository = new ScenarioRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this.scenarioRepository.retrieveAll(field,{}, callback);
  }

  create(item:any, callback:(error:any, result:any) => void) {
    this.scenarioRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error("Problem in Creating Scenario model"), null);
      }
      else {
        callback(null, res);
      }
    });
  }

  retrieveByMultiIds(item:any, callback:(error:any, result:any) => void) {
    this.scenarioRepository.retrieveByMultiIds(item,{ }, callback);
  }

}

Object.seal(ScenarioService);
export = ScenarioService;
