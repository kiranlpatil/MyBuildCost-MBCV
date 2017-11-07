import { FilterSort } from '../../dataaccess/model/filter';

export class QueryBuilder {

  static getFilterQuery(query : any, appliedFilters : FilterSort) : Object {
    let mainQuery: Object;
    if(appliedFilters.filterByLocation !== undefined  && appliedFilters.filterByLocation !== '') {
      query.$or =[{'location.city': appliedFilters.filterByLocation}];
    }
    if(appliedFilters.educationDataForFilter && appliedFilters.educationDataForFilter.length > 0 ) {
      query['professionalDetails.education'] = {$in: appliedFilters.educationDataForFilter};
    }
    if(appliedFilters.proficiencyDataForFilter && appliedFilters.proficiencyDataForFilter.length > 0 ) {
      query['proficiencies'] = {$in: appliedFilters.proficiencyDataForFilter};
    }
    if(appliedFilters.industryExposureDataForFilter && appliedFilters.industryExposureDataForFilter.length > 0 ) {
      query['interestedIndustries'] = {$in: appliedFilters.industryExposureDataForFilter};
    }
    if(appliedFilters.filterByJoinTime !== undefined  && appliedFilters.filterByJoinTime !== '') {
      query['professionalDetails.noticePeriod'] = appliedFilters.filterByJoinTime;
    }
    if(appliedFilters.salaryMinValue !== undefined  && appliedFilters.salaryMinValue !== '' &&
      appliedFilters.salaryMaxValue !== undefined  && appliedFilters.salaryMaxValue !== '') {
      query['professionalDetails.currentSalary'] = {$gte:Number(appliedFilters.salaryMinValue),
        $lte:Number(appliedFilters.salaryMaxValue)};
    }
    if(appliedFilters.experienceMinValue !== undefined  && appliedFilters.experienceMinValue !== '' &&
      appliedFilters.experienceMaxValue !== undefined  && appliedFilters.experienceMaxValue !== '') {
      query['professionalDetails.experience'] = {$gte:Number(appliedFilters.experienceMinValue),
        $lte:Number(appliedFilters.experienceMaxValue)};
    }
    switch (appliedFilters.sortBy) {
      case 'Salary':
        mainQuery = {'$query':query,'$orderby':{'professionalDetails.currentSalary':-1}};
        break;
      case 'Experience':
        mainQuery = {'$query':query,'$orderby':{'professionalDetails.experience':-1}};
        break;
      default :
        mainQuery= query;
        break;
    }
    return mainQuery;
  }

}
