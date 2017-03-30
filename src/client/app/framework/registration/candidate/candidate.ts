import {Location} from "../location";
export class Candidate {
  id : any;
  isCandidate :boolean;
  first_name: string;
  last_name : string;
  birth_year :number;
  email : string;
  mobile_number : string;
  password : string;
  conform_password : string;
  pin:number;
  location :Location;

  current_theme : string;
}
