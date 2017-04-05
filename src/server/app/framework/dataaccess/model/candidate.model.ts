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

interface CandidateModel {
  isVisible : boolean;
  aboutMyself: string;
  certifications : CertificationModel[];
  awards : AwardModel[];
  userId :  {type:mongoose.Schema.Types.ObjectId, ref:'User'};
  location: LocationModel;
  roles: RoleModel;
  academics :  AcademicModel[];
  professionalDetails :  ProfessionalDetailsModel[];
  employmentHistory : EmployeeHistoryModel[];
  proficiencies : string[];
}
export = CandidateModel;
