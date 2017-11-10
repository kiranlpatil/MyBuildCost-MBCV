import { Injectable, Pipe, PipeTransform } from '@angular/core';
import {SkillStatus} from "../../model/profile-comparison";

@Pipe({
  name: 'attributeFilter'
})
@Injectable()
export class AttributeFilterPipe implements PipeTransform {
  transform(array: SkillStatus[], filterFrom: string[]): any {
    return array.filter(item => filterFrom.some(f => f === item.name))
      .sort((a, b) => {
        let fromValues = filterFrom.map(f => f);
        return fromValues.indexOf(a.name) < fromValues.indexOf(b.name) ? -1 : 1;
      });

  }
}
