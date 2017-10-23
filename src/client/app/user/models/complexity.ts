import {Scenario} from "./scenario";
import {ComplexityDetails} from "./complexity-detail";
export class Complexity {
  name: string = '';
  code: string='' ;
  complexityDetails: ComplexityDetails = new ComplexityDetails();
  scenarios: Scenario[] = [];
  isChecked: boolean = false;
  questionForCandidate: string = '';
  questionForRecruiter: string = '';
  match: string;
  answer: string;
  complexityNote:string;
}
