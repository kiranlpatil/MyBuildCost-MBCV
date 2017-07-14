import ILocation = require("../mongoose/location");
import LocationModel = require("./location.model");


interface ProfessionalDetailsModel {
  education: string;
  experience: string;
  currentSalary: string;
  noticePeriod: string;
  relocate: string;
  industryExposure: string;
  currentCompany: string;
  location: LocationModel;
}
export = ProfessionalDetailsModel;

