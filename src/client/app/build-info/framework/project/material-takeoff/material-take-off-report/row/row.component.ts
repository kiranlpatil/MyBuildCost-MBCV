import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements } from '../../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-table-row',
  templateUrl: 'row.component.html',
  styleUrls: ['row.component.css'],
})

export class TableRowComponent {

  @Input() rows: any;
  @Input() customClass: string;

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }
}
