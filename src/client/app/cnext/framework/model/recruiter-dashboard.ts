import {JobPosterModel} from '../../../user/models/jobPoster';
export class RecruiterDashboard {
  isRecruitingForself: boolean;
  about_company: string;
  company_name: string;
  company_size: string;
  userId: string;
  _id: string;
  public postedJobs: string[] = new Array(0);
}
