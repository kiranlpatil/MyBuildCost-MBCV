import User = require("../mongoose/user");
import JobProfileModel = require("./jobprofile.model");
interface RecruiterModel {
  isRecruitingForself: boolean;
  company_name: string;
  company_size: string;
  company_logo: string;
  company_headquarter_country: string;
  setOfDocuments: string[];
  userId: any;
  postedJobs: JobProfileModel[];
  description1: string;
  description2: string;
  description3: string;
  about_company: string;
}

export = RecruiterModel
