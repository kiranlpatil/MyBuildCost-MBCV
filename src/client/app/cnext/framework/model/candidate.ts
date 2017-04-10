import {Industry} from "./industry";
import {Award} from "./award";
import {Academicdetails} from "./academic-details";
import {Certifications} from "./certification-accreditation";
import {ProfessionalData} from "./professional-data";
import {EmployementHistory} from "./employment-history";
export class Candidate {
  jobTitle : string;
  isVisible : boolean;
  aboutMyself: string;
  certifications : Certifications[]=new Array();
  awards : Award[]=new Array();
  industry : Industry=new Industry();
  intrestedIndustries : string[];
  roleType: string;
  academics :  Academicdetails[]=new Array();
  professionalDetails :  ProfessionalData=new ProfessionalData();
  employmentHistory : EmployementHistory[]=new Array();
  proficiencies : string[]=new Array();
}
