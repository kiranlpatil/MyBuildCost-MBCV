export class CandidateQCard {
  below_one_step_matching: number = 0;
  above_one_step_matching: number = 0;
  exact_matching: number = 0;
  mobile_number: string;
  first_name: string;
  email: string;
  last_name: string;
  matching: number;
  status: string;
  salaryMinValue: string;
  salaryMaxValue: string;
  salary: string;
  experience: string;
  experienceMinValue: string;
  experienceMaxValue: string;
  education: string;
  location: string;
  _id: string;
  noticePeriod: string;
  proficiencies: string[];
  interestedIndustries: string[];
  picture: string;
  isCandidateRead: boolean;
  isCandidateshortListed: boolean;
  isVisible: boolean;
}
