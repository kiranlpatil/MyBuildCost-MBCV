import {Industry} from "../../../user/models/industry";
import {Award} from "./award";
import {AcademicDetails} from "./academic-details";
import {Certifications} from "./certification-accreditation";
import {ProfessionalData} from "./professional-data";
import {EmployementHistory} from "./employment-history";
import {CandidateDetail} from "../../../user/models/candidate";
import {Location} from "../../../user/models/location";
import {Capability} from "./capability";
export class Candidate {
  personalDetails: CandidateDetail = new CandidateDetail();
  jobTitle: string;
  isVisible: boolean;
  location: Location = new Location();
  isSubmitted: boolean;
  aboutMyself: string = '';
  certifications: Certifications[] = [];
  awards: Award[] = [];
  industry: Industry = new Industry();
  capability_matrix:any;
  capabilities: Capability[] = new Array(0);
  interestedIndustries: string[] = new Array(0);
  roleType: string = '';
  academics: AcademicDetails[] = [];
  professionalDetails: ProfessionalData = new ProfessionalData();
  employmentHistory: EmployementHistory[] = [];
  proficiencies: string[] = new Array(0);
  secondaryCapability: string[] = [];
  lockedOn: Date;
  isCompleted: boolean;
  summary: Summary = new Summary();
  basicInformation: CandidateDetail = new CandidateDetail();
  _id: string;
}


export class Section {
  name: string = '';
  date: Date;
  isLocked: boolean;
  iscompleted: boolean;
  isDisable: boolean;
  isProficiencyFilled: boolean = false;
}

export class Summary {
  percentProfileCompleted: number = 70;
  numberOfTimeSearched: number = 9999;
  numberOfTimesViewed: number = 999;
  numberOfTimesAddedToCart: number = 99;
  numberOfJobApplied: number=0;
  numberJobsBlocked: number=0;
  numberOfmatched: number;
}
