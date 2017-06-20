import { Pipe, PipeTransform } from '@angular/core';
import { CandidateQCard } from '../model/candidateQcard';
let lastArgs: any = undefined;
let lastObject: any = undefined;


@Pipe({name: 'qcardlistsort', pure: false})

export class QCardListSortPipe implements PipeTransform {


  transform(array: Array<CandidateQCard>, args: string[]): Array<CandidateQCard> {
    if (array === null) {
      return null;
    }
    if (JSON.stringify(lastObject) === JSON.stringify(array) && lastArgs === args[0]) {
      return array;
    } else {
      lastObject = array;
      lastArgs = args[0];
    }
    if (args[0] === 'Best match') {
      array.sort((a: CandidateQCard, b: CandidateQCard) => {

        switch (args[1]) {
          case 'aboveMatch':
            if ((Number(a.exact_matching) + Number(a.above_one_step_matching)) > (Number(b.exact_matching) + Number(b.above_one_step_matching))) {
              return -1;
            } else if ((Number(a.exact_matching) + Number(a.above_one_step_matching)) < (Number(b.exact_matching) + Number(b.above_one_step_matching))) {
              return 1;
            } else {
              return 0;
            }
          case 'belowMatch':
            if (Number(a.matching) > Number(b.matching)) {
              return -1;
            } else if (Number(a.matching) < Number(b.matching)) {
              return 1;
            } else {
              return 0;
            }
          default:
            if (Number(a.matching) > Number(b.matching)) {
              return -1;
            } else if (Number(a.matching) < Number(b.matching)) {
              return 1;
            } else {
              return 0;
            }
        }
      });
    }
    if (args[0] === 'Experience' && args[2]==='candidate') {
      array.sort((a: CandidateQCard, b: CandidateQCard) => {
        if (Number(a.experience.split(' ')[0]) < Number(b.experience.split(' ')[0])) {
          return -1;
        } else if (Number(a.experience.split(' ')[0]) > Number(b.experience.split(' ')[0])) {
          return 1;
        } else {
          return 0;
        }
      });
    }else{
      if(args[0] === 'Experience' ) {
        array.sort((a:CandidateQCard, b:CandidateQCard) => {
          debugger
          if (Number(a.experience.split(' ')[0]) > Number(b.experience.split(' ')[0])) {
            return -1;
          } else if (Number(a.experience.split(' ')[0]) < Number(b.experience.split(' ')[0])) {
            return 1;
          } else {
            return 0;
          }
        });
      }
    }

    if(args[0] === 'Salary'  && args[2]==='candidate'){
      array.sort((a: CandidateQCard, b: CandidateQCard) => {
        if (Number(a.salary.split(' ')[0]) > Number(b.salary.split(' ')[0])) {
          return -1;
        } else if (Number(a.salary.split(' ')[0]) < Number(b.salary.split(' ')[0])) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    else {debugger
      if(args[0] === 'Salary') {
        array.sort((a:CandidateQCard, b:CandidateQCard) => {
          debugger
          if (Number(a.salary.split(' ')[0]) < Number(b.salary.split(' ')[0])) {
            return -1;
          } else if (Number(a.salary.split(' ')[0]) > Number(b.salary.split(' ')[0])) {
            return 1;
          } else {
            return 0;
          }
        });
      }
    }
    return array;
  }
}
