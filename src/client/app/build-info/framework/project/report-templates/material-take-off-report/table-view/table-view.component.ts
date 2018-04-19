import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements, PDFReportHeaders } from '../../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-table-view',
  templateUrl: 'table-view.component.html',
})

export class CostHeadWiseSingleElementComponent {
  @Input() reportData : any;

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  getPDFReportHeaders() {
    return PDFReportHeaders;
  }
}

