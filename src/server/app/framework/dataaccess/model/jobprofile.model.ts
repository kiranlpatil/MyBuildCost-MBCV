import LocationModel = require('./location.model');
import IndustryModel = require('./industry.model');
import CandidateListModel = require('./candidate-list.model');
import * as mongoose from 'mongoose';

interface JobProfileModel extends mongoose.Document {
  jobTitle: string;
  isJobPosted: boolean;
  hiringManager: string;
  department: string;
  education: string;
  experienceMaxValue: string;
  experienceMinValue: string;
  salaryMaxValue: string;
  salaryMinValue: string;
  joiningPeriod: string;
  proficiencies: string[];
  additionalProficiencies: string[];
  industry: IndustryModel;
  location: LocationModel;
  competencies: string;
  responsibility: string;
  postingDate: Date;
  expiringDate: Date;
  remark: string;
  interestedIndustries: string[];
  candidate_list: CandidateListModel[];
  capability_matrix: any;
  postedJobs: any;
  releventIndustries: string[];
  hideCompanyName: boolean;
}
export = JobProfileModel;
