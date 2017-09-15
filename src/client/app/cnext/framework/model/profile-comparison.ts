import {Certifications} from "./certification-accreditation";
import {Award} from "./award";
import {ProfessionalData} from "./professional-data";
import {AcademicDetails} from "./academic-details";
import {EmployementHistory} from "./employment-history";
import {Industry} from "../../../user/models/industry";
import {ProfileComparisonHeaderMeta} from "../profile-comparison/profile-comparison-header/profile-comparison-header-meta/profile-comparison-header-meta";
import {ProfileCapabilityComparisonMeta} from "../profile-comparison/profile-capability-comparison/profile-capability-comparison-meta/profile-capability-compariosn-meta";

export class ProfileComparison {
   profileComparisonJobData:CompareEntityDetails = new CompareEntityDetails();
   profileComparisonData:ProfileComparisonData[] = new Array(0);
 }

 export class ProfileComparisonData {

   _id: string;
   userId: any;
   industryName: string;
   capability_matrix:any;
   aboutMyself: string = '';
   lockedOn: Date;
   proficiencies: string[] = new Array(0);
   professionalDetails: ProfessionalData = new ProfessionalData();
   awards: Award[] = new Array(0);
   isVisible: boolean;
   isSubmitted: boolean;
   location: Location = new Location();
   certifications: Certifications[] = new Array(0);
   industry: Industry = new Industry();
   interestedIndustries: string[] = new Array(0);
   roleType: string = '';
   academics: AcademicDetails[] = new Array(0);
   employmentHistory: EmployementHistory[] = new Array(0);
   secondaryCapability: string[] =  new Array(0);
   isCompleted: boolean;
   //basicInformation: CandidateDetail = new CandidateDetail();


   salaryMatch: string;
   experienceMatch: string;
   educationMatch: string;
   releaseMatch: string;
   interestedIndustryMatch: string[] = new Array(0);
   proficienciesMatch: string[] = new Array(0);
   proficienciesUnMatch: string[] = new Array(0);
   profileComparisonHeader:ProfileComparisonHeaderMeta = new ProfileComparisonHeaderMeta();
   capabilityMap:ProfileCapabilityComparisonMeta[] = new Array(0);
   additionalCapabilites: string[] = new Array(0);

   matchingPercentage:number;
   status:string;
   candidateListStatus:string[];
   candidateSkillStatus:SkillStatus[];
 }

export class CompareEntityDetails {
  joiningPeriod:string;
  salaryMinValue:string;
  salaryMaxValue:string;
  experienceMinValue:string;
  experienceMaxValue:string;
  education:string;
  jobTitle:string;
  country:string;
  state:string;
  city:string;
  industryName:string;
  interestedIndustries:string[];
  proficiencies:string[];
}

export class SkillStatus {
  name:string;
  status:string;
}
