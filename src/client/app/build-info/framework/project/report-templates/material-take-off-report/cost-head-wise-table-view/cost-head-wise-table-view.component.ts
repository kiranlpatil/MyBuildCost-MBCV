import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements, PDFReportHeaders } from '../../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-head-wise-table-view',
  templateUrl: 'cost-head-wise-table-view.component.html',
})

export class CostHeadWiseTableViewComponent {
  @Input() reportData : any;

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  getPDFReportHeaders() {
    return PDFReportHeaders;
  }
}

