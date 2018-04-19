import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements, PDFReportHeaders } from '../../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-pdf-header',
  templateUrl: 'pdf-header.component.html',
})

export class PdfHeaderComponent {
  @Input() projectName : string;
  @Input() buildingName : string;
  public generatedDate: Date = new Date();

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  getPDFReportHeaders() {
    return PDFReportHeaders;
  }
}

