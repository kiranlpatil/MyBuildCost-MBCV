export class CandidateFilter {
  filterByValue:string='';
  filterName: string='';

  salaryMaxValue : string;
  salaryMinValue : string;
  experienceMaxValue : string;
  experienceMinValue : string;

  proficiencyDataForFilter : string[] = new Array(0);
  educationDataForFilter : string[] = new Array(0);
  industryExposureDataForFilter : string[] = new Array(0);
  filterByJoinTime:string;
  filterByLocation:string;
}
