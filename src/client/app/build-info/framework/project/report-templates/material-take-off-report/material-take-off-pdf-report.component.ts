import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MaterialTakeOffElements, PDFReportHeaders } from '../../../../../shared/constants';
import { CommonService } from '../../../../../shared/services/common.service';

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

  constructor(private commonService : CommonService) {
  }

  downloadToPdf() {
    let content = this.content.nativeElement.innerHTML;
    this.commonService.downloadToPdf(content);
  }

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  getPDFReportHeaders() {
    return PDFReportHeaders;
  }
}

