import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as jsPDF from 'jspdf';
/*/// <reference path='../../../../../../../tools/manual_typings/project/jspdf.d.ts'/>*/

@Component({
  moduleId: module.id,
  selector: 'cost-summary-report-pdf',
  templateUrl: 'cost-summary-report.component.html',
})

export class CostSummaryReportComponent {
  @ViewChild('costSummary') costSummary: ElementRef;
  @Input() buildingsReport: any;
  constructor() {
  }


  downloadToPdf() {
    let doc = new jsPDF();
    let specialElementHandlers = {
      '#editor': function (element : any, renderer : any) {
        return true;
      }
    };

    let costSummary = this.costSummary.nativeElement;
    doc.fromHTML(costSummary.innerHTML, 10, 10, {
      'width': 20,
      'elementHandlers': specialElementHandlers
    });

    doc.save('cost-summary-report.pdf');
  }
}
