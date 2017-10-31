export class QCardFilter {
  salaryMaxValue: string;
  salaryMinValue: string;
  experienceMaxValue: string;
  experienceMinValue: string;

  proficiencyDataForFilter: string[] = new Array(0);
  educationDataForFilter: string[] = new Array(0);
  industryExposureDataForFilter: string[] = new Array(0);
  filterByJoinTime: string;
  filterByLocation: string;
  filterByCompanySize: string;
  filterByMustHaveComplexity: boolean = false;
  query: any;
}
