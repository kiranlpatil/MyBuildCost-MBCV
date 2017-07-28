import {Pipe, PipeTransform} from "@angular/core";
@Pipe({name: 'keys', pure: false})

export class ProfileComparisonPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    return Object.keys(value)
  }
}
