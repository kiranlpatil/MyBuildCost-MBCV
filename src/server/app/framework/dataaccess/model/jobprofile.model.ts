import IProficiency = require("../mongoose/proficiency");
import IDomain = require("../mongoose/domain");
import ILocation = require("../mongoose/location");
import LocationModel = require("./location.model");
import ProficiencyModel = require("./proficiency.model");
import IndustryModel = require("./industry.model");
import CandidateListModel = require("./candidate-list.model");

interface JobProfileModel {
  jobTitle: string;
  hiringManager: string;
  department: string;
  education: string;
  //experience: string;
  experienceMaxValue: string;
  experienceMinValue: string;
  salaryMaxValue: string;
  salaryMinValue: string;
  //salary: string;
  joiningPeriod: string;
  proficiencies: string[];
  additionalProficiencies: string[];
  industry: IndustryModel;
  location: LocationModel;
  competencies: string;
  responsibility: string;
  postingDate: Date;
  remark: string;
  interestedIndustries: string[];
  candidate_list: CandidateListModel[];
  capability_matrix : Object;
}
export = JobProfileModel;
