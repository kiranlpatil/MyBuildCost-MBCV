import { Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { SessionStorageService } from '../../../../../../../shared/services/session.service';
import { SessionStorage } from '../../../../../../../shared/constants';

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

