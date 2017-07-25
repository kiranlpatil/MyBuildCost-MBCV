import * as mongoose from "mongoose";
import User = require("../mongoose/user");
import JobProfileModel = require("./jobprofile.model");
import CertificationModel = require("./certification.model");
import AwardModel = require("./award.model");
import LocationModel = require("./location.model");
import IndustryModel = require("./industry.model");
import AcademicModel = require("./academic.model");
import ProfessionalDetailsModel = require("./professional-details.model");
import EmployeeHistoryModel = require("./employee-history.model");
import JobListModel = require("./job-list.model");
import CapabilityMatrixModel = require("./capability-matrix.model");
import ProfileComparisonHeaderModel = require("./profile-comparison-header.model");

interface ProfileComparisonDataModel {
  isVisible: boolean;
  isSubmitted: boolean;
  aboutMyself: string;
  certifications: CertificationModel[];
  awards: AwardModel[];
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' };
  location: LocationModel;
  industry: IndustryModel;
  interestedIndustries: string[];
  roleType: string;
  academics: AcademicModel[];
  professionalDetails: ProfessionalDetailsModel;
  employmentHistory: EmployeeHistoryModel[];
  proficiencies: string[];
  secondaryCapability: string[];
  lockedOn: Date;
  job_list: JobListModel[];
  capability_matrix: any;
  salaryMatch: string;
  experienceMatch: string;
  educationMatch: string;
  releaseMatch: string;
  interestedIndustryMatch: string[];
  proficienciesMatch: string[];

  profileComparisonHeader: ProfileComparisonHeaderModel;
  capabilityMap: CapabilityMatrixModel[];

  matchingPercentage: number;
  status: string;
  additionalCapabilites: string[];
  companyCulture: string;

}

export = ProfileComparisonDataModel
