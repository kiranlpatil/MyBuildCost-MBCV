import { Industry } from './industry';
import { JobLocation } from './job-location';
import { CandidatesInDiffList } from './candidatesinDiffList';
export class JobPosterModel {
  _id: string;
  recruiterId: string;
  jobTitle: string = '';
  hiringManager: string = '';
  department: string = '';
  education: string = '';
  experienceMaxValue: string = '';
  experienceMinValue: string = '';
  salaryMaxValue: string = '';
  salaryMinValue: string = '';
  joiningPeriod: string = '';
  proficiencies: string[] = new Array(0);
  additionalProficiencies: string[] = new Array(0);
  industry: Industry = new Industry();
  capability_matrix:any;
  location: JobLocation = new JobLocation();
  competencies: string = '';
  responsibility: string = '';
  postingDate: Date;
  remark: string = '';
  roleType: string = '';
  interestedIndustries: string[] = new Array(0);
  candidate_list: any = new Array();
  numberOfCandidatesInList: CandidatesInDiffList = new CandidatesInDiffList();
}
