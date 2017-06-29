import { Industry } from './industry';
import { Award } from './award';
import { AcademicDetails } from './academic-details';
import { Certifications } from './certification-accreditation';
import { ProfessionalData } from './professional-data';
import { EmployementHistory } from './employment-history';
import { CandidateDetail } from '../../../framework/registration/candidate/candidate';
export class Candidate {
  jobTitle: string;
  isVisible: boolean;
  aboutMyself: string = '';
  certifications: Certifications[] = new Array();
  awards: Award[] = new Array();
  industry: Industry = new Industry();
  capability_matrix:any;
  interestedIndustries: string[] = new Array(0);
  roleType: string = '';
  academics: AcademicDetails[] = new Array();
  professionalDetails: ProfessionalData = new ProfessionalData();
  employmentHistory: EmployementHistory[] = new Array();
  proficiencies: string[] = new Array(0);
  secondaryCapability: string[] = new Array();
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
