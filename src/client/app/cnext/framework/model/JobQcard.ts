export class JobQcard {
  education: string;
  location: string;
  salaryMinValue: string;
  salaryMaxValue: string;
  company_size: string;
  experienceMinValue: string;
  experienceMaxValue: string;
  company_logo : string;
  matching: number;
  company_name: string;
  industry: string;
  _id: string;
  proficiencies: string[] = [];
  joiningPeriod: string;
  jobTitle: string;
  recruiterId: string;
  below_one_step_matching: number = 0;
  above_one_step_matching: number = 0;
  exact_matching: number = 0;
  postingDate: Date;
  hideCompanyName: boolean;
}
