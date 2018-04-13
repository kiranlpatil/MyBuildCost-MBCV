import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements } from '../../../../../../../shared/constants';


@Component({
  moduleId: module.id,
  selector: 'bi-sub-content',
  templateUrl: 'sub-content.component.html'
})

export class SubContentComponent {

  @Input() content: any;

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

}
