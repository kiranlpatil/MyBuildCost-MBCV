import {Scenario} from "./scenario";
export class Complexity {
  name: string = '';
  code: string='' ;
  scenarios: Scenario[] = [];
  isChecked: boolean = false;
  questionForCandidate: string = '';
  questionForRecruiter: string = '';
  match: string;
}
