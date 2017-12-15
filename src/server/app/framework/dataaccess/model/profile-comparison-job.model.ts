import EducationForJobModel = require('./education-for-job.model');

export class ProfileComparisonJobModel {

  joiningPeriod:string;
  salaryMinValue: string;
  salaryMaxValue: string;
  experienceMinValue: string;
  experienceMaxValue: string;
  education: string;
  jobTitle:string;
  country:string;
  state:string;
  city:string;
  industryName:string;
  interestedIndustries:string[];
  proficiencies:string[];
  educationForJob: EducationForJobModel[];
}
