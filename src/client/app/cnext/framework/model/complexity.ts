import { Scenario } from './scenario';
export class Complexity {
  name: string = '';
  code: string='' ;
  scenarios: Scenario[] = new Array();
  isChecked: boolean = false;
  match: string;
}
