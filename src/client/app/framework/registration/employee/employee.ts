import {Location} from "../location";
export class Employee {
  id : any;
  isCandidate :boolean;
  first_name: string;
  last_name : string;
  birth_year :number;
  email : string;
  mobile_number : string;
  password : string;
  conform_password : string;
  //country:string;
  //state:string;
  //city:string;
  pin:number;
  location :Location;

  current_theme : string;
}
