import ScenarioClassModel = require('./scenario-class.model');
class ComplexityClassModel {
  name: string;
  code : string;
  sort_order: number;
  question: string;
  questionForCandidate: string;
  questionForRecruiter: string;
  questionHeaderForCandidate: string;
  questionHeaderForRecruiter: string;
  scenarios: ScenarioClassModel[];
  match: string;

  constructor(name:string, code:string, sort_order:number, questionForCandidate:string, questionForRecruiter:string ,questionHeaderForCandidate:string, questionHeaderForRecruiter:string) {
    this.name = name;
    this.code = code;
    this.sort_order = sort_order;
    this.questionForCandidate = questionForCandidate;
    this.questionForRecruiter = questionForRecruiter;
    this.questionHeaderForCandidate = questionHeaderForCandidate;
    this.questionHeaderForRecruiter = questionHeaderForRecruiter;
  }

}
export = ComplexityClassModel;
