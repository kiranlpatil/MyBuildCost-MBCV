import LocationModel = require("../../dataaccess/model/location.model");
export class CandidateQCard {
  _id: string;
  first_name: string;
  last_name: string;
  below_one_step_matching: number = 0;
  above_one_step_matching: number = 0;
  exact_matching: number = 0;
  matching: number;
  salary: string;
  experience: string;
  location: string;
  education: string;
  proficiencies: string[];
  noticePeriod: string;
  interestedIndustries: string[];
  mobile_number: number;
  email: string;
  picture: string;
  isVisible: boolean;
  complexityIsMustHave: boolean = false;
}
