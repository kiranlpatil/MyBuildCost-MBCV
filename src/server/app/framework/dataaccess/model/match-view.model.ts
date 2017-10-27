import Match = require('./match-enum');
import ScenarioModel = require("./scenario.model");
class MatchViewModel {
  capability_name: string;
  capability_code: string;
  role_name: string;
  complexity_name: string;
  complexity_number: number;
  total_complexity_in_capability: number;
  candidate_scenario_name: string;
  job_scenario_name: string;
  scenario_name: string;
  match: Match;
  scenarios: ScenarioModel[];
  isChecked: boolean = false; //TODO
  questionForCandidate: string;
  questionForRecruiter: string;
  questionHeaderForCandidate: string;
  questionHeaderForRecruiter: string;
  code: string;
  userChoice: string;
  role_sort_order: string;
  capability_sort_order: string;
  complexity_sort_order: string;
  main_sort_order: number;
  complexityIsMustHave: boolean = false;
  complexityNote:string;
}

export = MatchViewModel;


