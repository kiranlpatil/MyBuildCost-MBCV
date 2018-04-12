import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements } from '../../../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-actual-content',
  templateUrl: 'actual-content.component.html'
})

export class ActualContentComponent {

  @Input() content: any;

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

}
