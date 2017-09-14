import {JobPosterModel} from "../../../user/models/jobPoster";
export class JobSummary {
  isRecruitingForself: boolean;
  company_name: string = '';
  company_size: string = '';
  company_logo: string = '';
  company_headquarter_country: string = '';
  setOfDocuments: string[] = new Array();
  userId: any;
  postedJobs: JobPosterModel[] = new Array();
  description1: string = '';
  description2: string = '';
  description3: string = '';
  about_company: string = '';
}
