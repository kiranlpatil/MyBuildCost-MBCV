import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements } from '../../../../../shared/constants';


@Component({
  moduleId: module.id,
  selector: 'bi-material-take-off-report',
  templateUrl: 'material-take-off-report.component.html',
  styleUrls: ['material-take-off-report.css'],
})

export class MaterialTakeOffReportComponent  {

  @Input() materialTakeOffReport : any;
  viewSubContent : boolean = false;
  headerIndex : number;
  dataIndex : number;


  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  showSubContent(secondaryViewDataIndex : number, tableHeaderIndex : number) {
    if(this.viewSubContent !== true || this.dataIndex !== secondaryViewDataIndex || this.headerIndex !== tableHeaderIndex) {
      this.dataIndex = secondaryViewDataIndex;
      this.headerIndex = tableHeaderIndex;
      this.viewSubContent = true;
    } else {
      this.viewSubContent = false;
    }
  }
}
