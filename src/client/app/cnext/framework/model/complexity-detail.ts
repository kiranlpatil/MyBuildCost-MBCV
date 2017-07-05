import {Scenario} from "./scenario";
export class ComplexityDetails {
  complexity_name: string = '';
  scenarios: Scenario[] = [];
  isChecked: boolean = false; //TODO
  questionForCandidate:string ='';
  questionForRecruiter:string ='';
  userChoice:string='';
  role_name: string = '';
  capability_name: string;
  defaultComplexityName:string='';
  code:string='';
}
