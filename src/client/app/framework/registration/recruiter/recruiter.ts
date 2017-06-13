import {Location} from "../location";
import {CompanyDetails} from "../company_details/company-details";

export class Recruiter {
  id: any;
  isCandidate: boolean;
  isRecruitingForself: boolean;
  company_name: string;
  company_size: string;
  email: string;
  mobile_number: string;
  password: string;
  confirm_password: string;
  location: Location;
  companyDetails: CompanyDetails;
  pin: string;
  captcha: string;
  current_theme: string;
  company_logo: string;
  company_headquarter_country: string;
}
