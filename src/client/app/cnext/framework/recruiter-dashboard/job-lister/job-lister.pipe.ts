import { Pipe, PipeTransform } from '@angular/core';
import { JobPosterModel } from '../../model/jobPoster';

@Pipe({name: 'orderBy', pure: false})

export class JobListerSortPipe implements PipeTransform {


  transform(array: Array<JobPosterModel>, args: string): Array<JobPosterModel> {
    if (array == null) {
      return null;
    }
    if (args === 'Date') {

      array.sort((a: JobPosterModel, b: JobPosterModel) => {
        if (a.postingDate > b.postingDate) {
          return -1;
        } else if (a.postingDate < b.postingDate) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return array;
  }
}
