import {Location} from "../../../user/models/location";

export class ProfessionalData {
  education: string = '';
  experience: string = '';
  currentSalary: string = '';
  noticePeriod: string = '';
  relocate: string = '';
  industryExposure: string = '';
  currentCompany: string = '';
  location: Location = new Location();
}
