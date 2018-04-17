import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as jsPDF from 'jspdf';
import {SessionStorageService} from "../../../../../shared/services/session.service";
import {SessionStorage} from "../../../../../shared/constants";
/*/// <reference path='../../../../../../../tools/manual_typings/project/jspdf.d.ts'/>*/

@Component({
  moduleId: module.id,
  selector: 'cost-summary-report-pdf',
  templateUrl: 'cost-summary-report.component.html',
})

export class CostSummaryReportComponent {
  @ViewChild('content') content: ElementRef;
  @Input() buildingReport: any;
  @Input() costingByUnit: any;
  @Input() costingByArea: any;
  currentProjectName: string;
  constructor() {
    this.currentProjectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
  }

  downloadToPdf() {
    let l = {
      orientation: 'l',
      unit: 'mm',
      format: 'a3',
      compress: true,
      fontSize: 8,
      lineHeight: 1,
      autoSize: false,
      printHeaders: true
    };

    let doc = new jsPDF(l, '', '', '');
    let specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    doc.setProperties({
      title: 'Test PDF Document',
      subject: 'This is the subject',
      author: 'author',
      keywords: 'generated, javascript, web 2.0, ajax',
      creator: 'author'
    });

    let content = this.content.nativeElement;
    doc.fromHTML(content.innerHTML, 12, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    });

    doc.cellInitialize();
    doc.margin = 1.5;
    doc.margins = 1.5;
    doc.setFont("courier");
    doc.setFontType("bolditalic");
    doc.setFontSize(9);
    doc.cell(2, 12, 35, 9, 0, 0 );
    doc.save('cost-summary-report.pdf');
  }
}

