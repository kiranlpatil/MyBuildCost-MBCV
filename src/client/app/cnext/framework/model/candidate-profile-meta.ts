import {AcademicDetails} from "./academic-details";
import {Award} from "./award";
import {Certifications} from "./certification-accreditation";
import {EmployementHistory} from "./employment-history";
import {Industry} from "./industry";
import {ProfessionalData} from "./professional-data";
import {Location} from "../../../framework/registration/location";

export class CandidateProfileMeta {
  _id:string;
  aboutMyself:string = '';
  academics:AcademicDetails[] = new Array(0);
  awards:Award[] = new Array(0);
  certifications:Certifications[] = new Array(0);
  employmentHistory:EmployementHistory[] = new Array(0);
  industry:Industry = new Industry();
  interestedIndustries:string[] = new Array(0);
  isCompleted:boolean;
  isSubmitted:boolean;
  isVisible:boolean;
  jobTitle:string;
  location:Location = new Location();
  lockedOn:Date;
  professionalDetails:ProfessionalData = new ProfessionalData();
  proficiencies:string[] = new Array(0);
  userId:UserDetails = new UserDetails();
}

export class UserDetails {
  first_name:string;
  last_name:string;
  email:string;
  mobile_number:string;
  picture:string;
}
