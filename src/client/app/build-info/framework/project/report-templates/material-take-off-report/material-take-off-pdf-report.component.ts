import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MaterialTakeOffElements, PDFReportHeaders } from '../../../../../shared/constants';
import { SharedService } from '../../../../../shared/services/shared-service';

@Component({
  moduleId: module.id,
  selector: 'bi-material-take-off-pdf-report',
  templateUrl: 'material-take-off-pdf-report.component.html',
})

export class MaterialTakeOffPdfReportComponent {
  @ViewChild('content', {read: ElementRef}) content: ElementRef;
  @Input() buildingName : string;
  @Input() elementType : string;
  @Input() elementName : string;
  @Input() materialTakeOffReport : any;
  public generatedDate: Date = new Date();

  constructor(private sharedService : SharedService) {
  }

  downloadToPdf() {
    let content = this.content.nativeElement.innerHTML;
    this.sharedService.downloadToPdf(content);
  }

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  getPDFReportHeaders() {
    return PDFReportHeaders;
  }
}

