import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements } from '../../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-table-row',
  templateUrl: 'row.component.html'
})

export class TableRowComponent {

  @Input() rows: any;

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }
}
