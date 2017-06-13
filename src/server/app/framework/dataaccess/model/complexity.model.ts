import IScenario = require("../mongoose/scenario");
import ScenarioModel = require("./scenario.model");
interface ComplexityModel {
  name: string;
  scenarios: ScenarioModel[];
  match: string;

}
export = ComplexityModel;
