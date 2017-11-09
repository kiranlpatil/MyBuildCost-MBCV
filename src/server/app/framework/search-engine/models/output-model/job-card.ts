import { QCard } from './q-card';
import CandidateListModel = require('../../../dataaccess/model/candidate-list.model');

export class JobCard extends QCard {
  company_name: string;
  salaryMinValue: string;
  salaryMaxValue: string;
  experienceMinValue: string;
  experienceMaxValue: string;
  education: string;
  company_size: string;
  company_logo: string;
  postingDate: Date;
  industry: string;
  jobTitle: string;
  hideCompanyName: boolean;
  candidate_list: CandidateListModel[];
  isJobPostClosed: boolean;
  constructor(company_name : string, salaryMinValue : string,
              salaryMaxValue : string, experienceMinValue : string,
              experienceMaxValue : string, education : string,
              company_size : string, company_logo : string,
              postingDate : string, industry : string,
              jobTitle : string, hideCompanyName : string,
              candidate_list : CandidateListModel[], isJobPostClosed : boolean,
              _id : string, above_one_step_matching : number,
              exact_matching : number, location : string, proficiencies : string[]) {
    super(_id,above_one_step_matching,exact_matching,location,proficiencies);
    this.company_name =  company_name;
    this.salaryMinValue = salaryMinValue;
    this.salaryMaxValue = salaryMaxValue;
    this.experienceMinValue = experienceMinValue;
    this.experienceMaxValue = experienceMaxValue;
    this.education = education;
    this.company_size = company_size;
    this.company_logo = company_logo;
    this.postingDate = postingDate;
    this.industry = industry;
    this.jobTitle = jobTitle;
    this.hideCompanyName = hideCompanyName;
    this.candidate_list = candidate_list[];
    this.isJobPostClosed = isJobPostClosed;
  }
}
