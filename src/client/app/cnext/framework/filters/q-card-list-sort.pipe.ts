import {Pipe, PipeTransform} from '@angular/core';
import {CandidateQCard} from "../model/candidateQcard";
let lastArgs:any= undefined;

@Pipe({name: 'qcardlistsort', pure: false})

export class QCardListSortPipe implements PipeTransform {


  transform(array: Array<CandidateQCard>, args: string): Array<CandidateQCard> {
    if (array == null) {
      return null;
    }
    if(lastArgs == args){
      return array
    }else{
      lastArgs =args;
    }
    if (args === 'Best match') {
      array.sort((a: CandidateQCard, b: CandidateQCard) => {
        if (Number(a.matching) > Number(b.matching)) {
          return -1;
        } else if (Number(a.matching) < Number(b.matching)) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    if (args === 'Experience') {
      array.sort((a: CandidateQCard, b: CandidateQCard) => {
        if (Number(a.experience.split(" ")[0]) > Number(b.experience.split(" ")[0])) {
          return -1;
        } else if (Number(a.experience.split(" ")[0]) < Number(b.experience.split(" ")[0])) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    if (args === 'Salary') {
      array.sort((a: CandidateQCard, b: CandidateQCard) => {
        if (Number(a.salary.split(" ")[0]) > Number(b.salary.split(" ")[0])) {
          return -1;
        } else if (Number(a.salary.split(" ")[0]) < Number(b.salary.split(" ")[0])) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return array;
  }
}
