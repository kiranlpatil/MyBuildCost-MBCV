import {Pipe, PipeTransform} from '@angular/core';
import {CandidateQCard} from "../model/candidateQcard";

@Pipe({name: 'orderby', pure: false})

export class SortPipe implements  PipeTransform{


  transform(array: Array<CandidateQCard>, args: string): Array<CandidateQCard> {
    if (array == null ) {
      return null;
    }
    if(args==='BestMatch' && args!==""){
    array.sort((a: CandidateQCard, b: CandidateQCard) => {
      if (Number(a.matching) >= Number(b.matching) ){
        return -1;
      }else if( Number(a.matching) <= Number(b.matching) ){
        return 1;
      }else{
        return 0;
      }
    });}
    if(args==='Experience' && args!==""){
      array.sort((a: CandidateQCard, b: CandidateQCard) => {
        if (Number(a.experience.split(" ")[0]) >= Number(b.experience.split(" ")[0]) ){
          return -1;
        }else if( Number(a.experience.split(" ")[0]) <= Number(b.experience.split(" ")[0]) ){
          return 1;
        }else{
          return 0;
        }
      });
    } if(args==='Salary' && args!==""){
      array.sort((a: CandidateQCard, b: CandidateQCard) => {
        if (Number(a.salary.split(" ")[0]) >= Number(b.salary.split(" ")[0])){
          return -1;
        }else if(Number(a.salary.split(" ")[0]) <= Number(b.salary.split(" ")[0])){
          return 1;
        }else{
          return 0;
        }
      });
    }
    return array;
  }
}
