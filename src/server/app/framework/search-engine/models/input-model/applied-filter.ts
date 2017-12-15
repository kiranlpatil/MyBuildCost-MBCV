import { ESort } from './sort-enum';
import { EList } from './list-enum';

export class Academics {
  educationDegree: string;
  specialization: string;
}

export class AppliedFilter{
  maxSalary: number;
  minSalary: number;
  minExperience: number;
  maxExperience: number;
  proficiencies: string[] = new Array(0);
  interestedIndustries: string[]= new Array();
  academics: string[]= new Array();
  specialization: string[]= new Array();
  education: string[] = new Array(0);
  joinTime: string;
  location: string;
  companySize: string;
  mustHaveComplexity: boolean = false;
  sortBy: ESort = ESort.BEST_MATCH;
  listName: EList;
  recruiterId: string;
  isCandidateSearch:boolean=false;
  isMasterData:boolean=false;
}

