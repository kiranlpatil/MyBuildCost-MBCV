import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'bi-table-row-pdf',
  templateUrl: 'table-row.component.html',
})

export class TableRowDataComponent {

  @Input() tableData : any;

}

