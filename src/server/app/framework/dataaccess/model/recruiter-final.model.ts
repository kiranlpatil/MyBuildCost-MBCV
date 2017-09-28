import JobProfileModel = require("./jobprofile.model");
import {JobCountModel} from "./job-count.model";
export class Recruiter { // todo replace all the interface to class
  isRecruitingForself: boolean;
  company_name: string;
  company_size: string;
  company_logo: string;
  company_website: string;
  company_headquarter_country: string;
  setOfDocuments: string[];
  userId: any;
  postedJobs: JobProfileModel[];
  jobCountModel: JobCountModel = new JobCountModel();
  description1: string;
  description2: string;
  description3: string;
  about_company: string;
}
