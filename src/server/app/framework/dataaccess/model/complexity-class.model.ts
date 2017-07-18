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

  constructor (complexity:any){
    this.name = complexity.complexity;
    this.code = complexity.complexity_code;
    this.questionForCandidate = complexity.complexity_question_for_participant;
    this.questionForRecruiter = complexity.complexity_question_for_recruiter;
  }

}
export = ComplexityClassModel;
