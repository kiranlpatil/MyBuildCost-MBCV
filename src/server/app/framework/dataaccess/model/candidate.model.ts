import User = require("../mongoose/user");
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
import UserModel = require("./user.model");
import CapabilityClassModel = require("./capability-class.model");


interface CandidateModel {

  jobTitle: string;
  isVisible: boolean;
  lastUpdateAt:any;
  isSubmitted: boolean;
  isCompleted:boolean;
  aboutMyself: string;
  certifications: CertificationModel[];
  awards: AwardModel[];
  userId: any;
  location: LocationModel;
  areaOfWork: string[];
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
  complexity_note_matrix:any;
  salaryMatch: string;
  experienceMatch: string;
  educationMatch: string;
  releaseMatch: string;
  interestedIndustryMatch: string[];
  proficienciesMatch: string[];
  personalDetails: User;
  profile_update_tracking:number;
  userFeedBack: number[];
  _id:any;
}
export = CandidateModel;
