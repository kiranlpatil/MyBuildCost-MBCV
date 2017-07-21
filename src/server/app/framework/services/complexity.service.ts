import ComplexityClassModel = require('../dataaccess/model/complexity-class.model');
var config = require('config');
import CNextMessages = require('../shared/cnext-messages');
import ProjectAsset = require('../shared/projectasset');
import ComplexityRepository = require('../dataaccess/repository/complexity.repository');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import ScenarioClassModel = require('../dataaccess/model/scenario-class.model');
class ComplexityService {
  private complexityRepository: ComplexityRepository;
  private industryRepository: IndustryRepository;

  APP_NAME: string;

  constructor() {
    this.complexityRepository = new ComplexityRepository();
    this.industryRepository = new IndustryRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.complexityRepository.retrieveAll({}, callback);
  }

  create(item: any, callback: (error: any, result: any) => void) {
    this.complexityRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error('Problem in Creating Complexity model'), null);
      } else {
        callback(null, res);
      }
    });
  }

  retrieveByMultiIds(item: any, callback: (error: any, result: any) => void) {
    this.complexityRepository.retrieveByMultiIds(item, {_id: 0}, callback);
  }


  findByName(field: any, callback: (error: any, result: any) => void) {
    this.industryRepository.findComplexities(field, callback);
  }

  addComplexities(currentRow:any, complexities:any) {
    if (complexities.length !== 0) {
      for (let i = 0; i < complexities.length; i++) {
        if (currentRow.complexity === complexities[i].name) {
          //addScenario();
        } else {
          if (i === (complexities.length - 1)) {
            var newComplexity = new ComplexityClassModel(currentRow.complexity, currentRow.complexity_code, currentRow.complexity_display_sequence, currentRow.complexity_question_for_participant, currentRow.complexity_question_for_recruiter);
            let scenarios:ScenarioClassModel[] = new Array(0);
            for (let sceIndex:number = 0; sceIndex < 5; sceIndex++) {
              let sceName = 'Scenario' + (sceIndex + 1).toString();
              let newScenario:ScenarioClassModel = new ScenarioClassModel(currentRow[sceName], ((sceIndex + 1) * 10).toString());
              if (newScenario.name !== '') {
                scenarios.push(newScenario);
              }
            }
            let s:ScenarioClassModel = new ScenarioClassModel('Not Applicable', '' + 0);
            scenarios.push(s);
            newComplexity.scenarios = scenarios;
            complexities.push(newComplexity);
          }
        }
      }
      return complexities;
    } else {
      var newComplexity = new ComplexityClassModel(currentRow.complexity, currentRow.complexity_code, currentRow.complexity_display_sequence, currentRow.complexity_question_for_participant, currentRow.complexity_question_for_recruiter);
      let scenarios:ScenarioClassModel[] = new Array(0);
      for (let sceIndex:number = 0; sceIndex < 5; sceIndex++) {
        let sceName = 'Scenario' + (sceIndex + 1).toString();
        let newScenario:ScenarioClassModel = new ScenarioClassModel(currentRow[sceName], ((sceIndex + 1) * 10).toString());
        if (newScenario.name !== '') {
          scenarios.push(newScenario);
        }
      }
      let s:ScenarioClassModel = new ScenarioClassModel('Not Applicable', '' + 0);
      scenarios.push(s);
      newComplexity.scenarios = scenarios;
      complexities.push(newComplexity);
      return complexities;
    }
  }

}

Object.seal(ComplexityService);
export = ComplexityService;
