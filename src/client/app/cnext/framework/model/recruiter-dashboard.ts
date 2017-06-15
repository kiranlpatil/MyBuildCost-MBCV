import { JobPosterModel } from './jobPoster';
export class RecruiterDashboard {

  //public candidateCountModel:RecruiterHeaderDetails;
  about_company: string;
  company_name: string;
  company_size: string;
  userId: string;
  _id: string;
  public postedJobs: JobPosterModel[] = new Array(0);

}
