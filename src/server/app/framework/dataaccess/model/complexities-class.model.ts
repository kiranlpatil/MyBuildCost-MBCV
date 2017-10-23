import ScenarioClassModel = require('./scenario-class.model');
class ComplexitiesClassModel {
  name: string;
  code: string;
  sort_order: number;
  question: string;
  questionForCandidate: string;
  questionForRecruiter: string;
  scenarios: ScenarioClassModel[];
  match: string;
  answer: string;
  note:string;
}
export = ComplexitiesClassModel;
