import {Location} from "./location";
import {CompanyDetails} from "./company-details";
import {JobPosterModel} from "./jobPoster";

export class Recruiter {
  id: any;
  isCandidate: boolean;
  isRecruitingForself: boolean;
  company_name: string;
  company_size: string;
  company_website: string;
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
  setOfDocuments: string[];
  userId: any;
  postedJobs: JobPosterModel[];
  description1: string;
  description2: string;
  description3: string;
  about_company: string;
}
