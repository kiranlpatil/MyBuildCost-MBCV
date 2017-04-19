import {  Location  } from '../location';
export class CandidateDetail {
  id : any;
  isCandidate :boolean;
  first_name: string;
  last_name : string;
  birth_year :number;
  email : string;
  mobile_number : string;
  password : string;
  conform_password : string;
  pin:string;
  location :Location;
  current_theme : string;
}
