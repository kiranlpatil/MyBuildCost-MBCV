import IScenario = require("../mongoose/scenario");
import ScenarioModel = require("./scenario.model");
interface ComplexityModel {
  name: string;
  code : string;
  scenarios: ScenarioModel[];
  match: string;

}
export = ComplexityModel;
