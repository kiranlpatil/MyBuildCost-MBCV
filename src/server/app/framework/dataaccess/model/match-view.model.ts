import Match = require('./match-enum');
import ScenarioModel = require("./scenario.model");
class MatchViewModel {
  capability_name: string;
  role_name: string;
  complexity_name: string;
  scenario_name: string;
  match: Match;
  scenarios: ScenarioModel[];
  isChecked: boolean = false; //TODO
  questionForCandidate: string;
  questionForRecruiter: string;
  code: string;
  userChoice: string;
}

export = MatchViewModel;


