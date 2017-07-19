import IScenario = require("../mongoose/scenario");
import ScenarioClassModel = require("./scenario-class.model");
class ComplexityClassModel {
  name: string;
  code : string;
  sort_order: number;
  question: string;
  questionForCandidate: string;
  questionForRecruiter: string;
  scenarios: ScenarioClassModel[];
  match: string;

  constructor(name:string, code:string, questionForCandidate:string, questionForRecruiter:string) {
    this.name = name;
    this.code = code;
    this.questionForCandidate = questionForCandidate;
    this.questionForRecruiter = questionForRecruiter;
  }

}
export = ComplexityClassModel;
