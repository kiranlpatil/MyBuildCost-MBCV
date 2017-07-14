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

}
export = ComplexityClassModel;
