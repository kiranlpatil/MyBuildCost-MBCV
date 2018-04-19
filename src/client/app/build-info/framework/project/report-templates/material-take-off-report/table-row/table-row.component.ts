import { Component, Input, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'bi-table-row-pdf',
  templateUrl: 'table-row.component.html',
})

export class TableRowDataComponent implements OnInit{

  @Input() tableData : any;

  ngOnInit() {
    console.log('tableData -> '+JSON.stringify(this.tableData));
  }

}

