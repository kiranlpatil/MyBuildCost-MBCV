import {Pipe, PipeTransform} from '@angular/core';
import {CandidateFilter} from "../model/candidate-filter";
import {CandidateQCard} from "../model/candidateQcard";

@Pipe({name: 'dashboardfilter', pure: false})

export class CandidateDashboardFilterPipe implements  PipeTransform {


  transform(array: Array<CandidateQCard>, args: CandidateFilter): Array<any> {
    if (array == null) {
      return null;
    }

    if (args) {
      //return array.filter(item => item.proficiencies.toLowerCase().indexOf(args.filterByValue.toLowerCase()) !== -1);

      return array.filter(item => eval(args.query)
        /*(args.proficiencyDataForFilter.length && (item.proficiencies.filter(function (obj) {return args.proficiencyDataForFilter.indexOf(obj) !== -1;}).length == args.proficiencyDataForFilter.length))  ||

        (args.educationDataForFilter.length && (args.educationDataForFilter.indexOf(item.education) !== -1)) ||

        (args.industryExposureDataForFilter.length && (item.interestedIndustries.filter(function (obj) {return args.industryExposureDataForFilter.indexOf(obj) !== -1;}).length == args.industryExposureDataForFilter.length)) ||

        ((Number(args.salaryMaxValue) && Number(args.salaryMinValue)) && (Number(item.salary.split(" ")[0]) >= Number(args.salaryMinValue) && Number(item.salary.split(" ")[0]) <= Number(args.salaryMaxValue))) ||

        ((Number(args.experienceMinValue) && Number(args.experienceMaxValue)) && (Number(item.experience.split(" ")[0]) >= Number
        (args.experienceMinValue) && Number(item.experience.split(" ")[0]) <= Number
        (args.experienceMaxValue))) ||

        ((args.filterByJoinTime) && (args.filterByJoinTime && item.noticePeriod) && (args.filterByJoinTime.toLowerCase() === item.noticePeriod.toLowerCase())) ||

        ((args.filterByLocation && item.location) && (args.filterByLocation.toLowerCase() === item.location.toLowerCase()))*/
      );
    }
    return array;
  }
}
