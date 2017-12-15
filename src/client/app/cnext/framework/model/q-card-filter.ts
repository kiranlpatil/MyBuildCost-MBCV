import { ESort } from './sort-type';
import { EList } from './list-type';
export class QCardFilter {
  maxSalary: number;
  minSalary: number;
  minExperience: number;
  maxExperience: number;
  proficiencies: string[] = new Array(0);
  education: string[] = new Array(0);
  interestedIndustries: string[] = new Array(0);
  academics: string[] = new Array(0);
  specialization: string[] = new Array(0);
  joinTime: string;
  location: string;
  companySize: string;
  mustHaveComplexity: boolean = false;
  query: any;
  sortBy: ESort= ESort.BEST_MATCH;
  listName: EList;
  recruiterId: string;
}
