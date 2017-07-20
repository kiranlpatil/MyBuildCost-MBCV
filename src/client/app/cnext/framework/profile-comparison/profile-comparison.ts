
 import {Candidate, Summary} from "../model/candidate";
 import {Certifications} from "../model/certification-accreditation";
 import {Award} from "../model/award";
 import {ProfessionalData} from "../model/professional-data";
 import {AcademicDetails} from "../model/academic-details";
 import {EmployementHistory} from "../model/employment-history";
 import {CandidateDetail} from "../../../framework/registration/candidate/candidate";
 import {Industry} from "../model/industry";

 export class ProfileComparison {

   jobTitle: string;
   isVisible: boolean;
   location: Location = new Location();
   isSubmitted: boolean;
   aboutMyself: string = '';
   certifications: Certifications[] = [];
   awards: Award[] = [];
   industry: Industry = new Industry();
   capability_matrix:any;
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
