import ILocation = require("../mongoose/location");

interface ProfessionalDetailsModel {
  education: string;
  experience: string;
  currentSalary: string;
  noticePeriod: string;
  relocate: string;
}
export = ProfessionalDetailsModel;

