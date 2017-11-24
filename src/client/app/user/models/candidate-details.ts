import {Location} from "./location";
export class CandidateDetail {
  _id:any;
  isCandidate: boolean;
  isActivated: boolean;
  isAdmin: boolean;
  first_name: string = '';
  last_name: string = '';
  birth_year: number;
  email: string = '';
  company_website: string = '';
  company_name: string = '';
  mobile_number: string = '';
  password: string = '';
  confirm_password: string = '';
  pin: string = '';
  location: Location= new Location();
  current_theme: string;
  picture: string = "/assets/framework/images/dashboard/default-profile.png";
  social_profile_picture: string;
  guided_tour:string[] = new Array(0);
  recruiterReferenceId: string;
}
