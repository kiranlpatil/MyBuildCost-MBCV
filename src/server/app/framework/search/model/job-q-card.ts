import CandidateListModel = require("../../dataaccess/model/candidate-list.model");
export class JobQCard {

  company_name: string;
  below_one_step_matching: number = 0;
  above_one_step_matching: number = 0;
  exact_matching: number = 0;
  matching: number;
  salaryMinValue: string;
  salaryMaxValue: string;
  experienceMinValue: string;
  experienceMaxValue: string;
  education: string;
  location: string;
  company_size: string;
  interestedIndustries: string[];
  proficiencies: string[];
  company_logo: string;
  company_website: string;
  joiningPeriod: string;
  postingDate: Date;
  industry: string;
  jobTitle: string;
  _id: string;
  hideCompanyName: boolean;
  candidate_list:CandidateListModel[];
}
