import { Scenario } from './scenario';
export class ComplexityDetails {
  name: string = '';
  scenarios: Scenario[] = new Array();
  isChecked: boolean = false; //TODO
  questionForCandidate:string ='';
  questionForRecruiter:string ='';
  userChoice:string='';
  rolename:string='';
  capabilityName:string;
  defaultComplexityName:string='';
  code:string='';
}
