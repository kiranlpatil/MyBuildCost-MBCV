import User = require("../mongoose/user");
import JobProfileModel = require("./jobprofile.model");

interface ProfileComparisonHeaderModel {
 // _id: any;
  isCandidate: boolean;
  first_name: string;
  last_name: string;
  //birth_year: number;
  email: string;
  mobile_number: number;
  picture: string;
}

export = ProfileComparisonHeaderModel
