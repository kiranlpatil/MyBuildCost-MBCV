import {Scenario} from "./scenario";
export class ComplexityDetails {
  complexity_name: string = '';
  scenarios: Scenario[] = [];
  isChecked: boolean = false; //TODO
  questionForCandidate:string ='';
  questionForRecruiter:string ='';
  questionHeaderForCandidate:string ='';
  questionHeaderForRecruiter:string ='';
  userChoice:string='';
  role_name: string = '';
  capability_name: string;
  capability_code: string;
  complexity_number: number;
  total_complexity_in_capability: number;
  defaultComplexityName:string='';
  code:string='';
}
