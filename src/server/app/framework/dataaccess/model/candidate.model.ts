import User = require("../mongoose/user");
import * as mongoose from "mongoose";
import LocationModel = require("./location.model");
import AcademicModel = require("./academic.model");
import ProfessionalDetailsModel = require("./professional-details.model");
import EmployeeHistoryModel = require("./employee-history.model");
import ProficiencyModel = require("./proficiency.model");
import CapabilityModel = require("./capability.model");
import RoleModel = require("./role.model");
import CertificationModel = require("./certification.model");
import AwardModel = require("./award.model");
import IndustryModel = require("./industry.model");
import JobListModel = require("./job-list.model");


interface CandidateModel {

  jobTitle : string;
  isVisible : boolean;
  aboutMyself: string;
  certifications : CertificationModel[];
  awards : AwardModel[];
  userId :  {type:mongoose.Schema.Types.ObjectId, ref:'User'};
  location: LocationModel;
  industry : IndustryModel;
  interestedIndustries : string[];
  roleType: string;
  academics :  AcademicModel[];
  professionalDetails :  ProfessionalDetailsModel;
  employmentHistory : EmployeeHistoryModel[];
  proficiencies : string[];
  secondaryCapability : string[];
  lockedOn: Date;
  job_list : JobListModel[];
  salaryMatch : string;
  experienceMatch : string;
  educationMatch : string;
  releaseMatch : string;
  interestedIndustryMatch : string[];
  proficienciesMatch : string[];

}
export = CandidateModel;
