import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements, PDFReportHeaders } from '../../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-material-wise-table-view',
  templateUrl: 'material-wise-table-view.component.html',
})

export class MaterialWiseTableViewComponent {
  @Input() reportData : any;

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  getPDFReportHeaders() {
    return PDFReportHeaders;
  }
}

