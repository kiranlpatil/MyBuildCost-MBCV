import {Location} from "./location";

export class ProfessionalData {
  education: string = '';
  experience: number;
  currentSalary: number;
  noticePeriod: string = '';
  relocate: string = '';
  industryExposure: string = '';
  currentCompany: string = '';
  location: Location = new Location();
}
