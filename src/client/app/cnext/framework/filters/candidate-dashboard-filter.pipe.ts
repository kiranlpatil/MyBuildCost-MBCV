import {Pipe, PipeTransform} from '@angular/core';
import {CandidateFilter} from "../model/candidate-filter";
import {CandidateQCard} from "../model/candidateQcard";

@Pipe({name: 'dashboardfilter', pure: false})

export class CandidateDashboardFilterPipe implements  PipeTransform{


  transform(array: Array<CandidateQCard>, args:CandidateFilter ): Array<any> {
  var candidatesArray:CandidateQCard[] = new Array();
    //candidatesArray = array;
    if (array == null ) {
      return null;
    }

    if(args) {

      //return array.filter(item => item.proficiencies.toLowerCase().indexOf(args.filterByValue.toLowerCase()) !== -1);
      if(args.proficiencyDataForFilter.length) {
        //item.proficiencies.toLowerCase().indexOf(args.filterByValue.toLowerCase()) !== -1);
        for(var i=0;i<args.proficiencyDataForFilter.length;i++) {
            array.filter(item => {
              if(item.proficiencies.indexOf(args.proficiencyDataForFilter[i]) !== -1) {
                if(candidatesArray.indexOf(item) == -1) {
                  candidatesArray.push(item);
                }
              }
            });
        }
      }
      if(args.educationDataForFilter.length) {
        for(var i=0;i<args.educationDataForFilter.length;i++) {
          array.filter(item => {
            if(item.education.toLowerCase() == args.educationDataForFilter[i].toLowerCase()) {
              if(candidatesArray.indexOf(item) == -1) {
                candidatesArray.push(item);
              }
            }
          });
        }
      }
      if(args.industryExposureDataForFilter.length) {
        for(var i=0;i<args.industryExposureDataForFilter.length;i++) {
          array.filter(item => {
            if(item.interestedIndustries.indexOf(args.industryExposureDataForFilter[i]) !== -1) {
              if(candidatesArray.indexOf(item) == -1) {
                candidatesArray.push(item);
              }
            }
          });
        }
      }
      if(Number(args.salaryMaxValue) && Number(args.salaryMinValue)) {
        array.filter(item => {
          if(Number(item.salary.split(" ")[0]) >= Number(args.salaryMinValue) && Number(item.salary.split(" ")[0]) <= Number(args.salaryMaxValue)) {
            if(candidatesArray.indexOf(item) == -1) {
              candidatesArray.push(item);
            }
          }
        });
      }
      if(Number(args.experienceMinValue) && Number(args.experienceMaxValue)) {
        array.filter(item => {
          if(Number(item.experience.split(" ")[0]) >= Number(args.experienceMinValue) && Number(item.experience.split(" ")[0]) <= Number(args.experienceMaxValue)) {
            if(candidatesArray.indexOf(item) == -1) {
              candidatesArray.push(item);
            }
          }
        });
      }
      if(args.filterByJoinTime) {
        array.filter(item => {
          if(args.filterByJoinTime === item.noticePeriod) {
            if(candidatesArray.indexOf(item) == -1) {
              candidatesArray.push(item);
            }
          }
        });
      }
      if(args.filterByLocation) {
        array.filter(item => {
          if(args.filterByLocation.toLocaleLowerCase() === item.location.toLocaleLowerCase()) {
            if(candidatesArray.indexOf(item) == -1) {
              candidatesArray.push(item);
            }
          }
        });
      }
      if(candidatesArray.length == 0) {
        return array;
      }
    } else {
      return array;
    }
    //Array.from(new Set(candidatesArray.map((itemInArray) => itemInArray.app)));
    return candidatesArray;
  }
}
