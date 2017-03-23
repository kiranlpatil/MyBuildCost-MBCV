/**
 * Created by techprimelab on 3/9/2017.
 */
import {Location} from "../location";

export class Employer {
  id : any;
  isCandidate :boolean;
  isRecruitingForself :boolean;
  company_name: string;
  company_size : string;
  email : string;
  mobile_number : string;
  password : string;
  conform_password : string;
  location:Location;
  pin:number;
  captcha:string;
  current_theme : string;
  company_logo:string;
}
