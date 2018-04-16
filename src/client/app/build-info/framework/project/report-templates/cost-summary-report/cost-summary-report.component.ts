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
  currentProjectName: string;
  constructor() {
    this.currentProjectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
  }

  downloadToPdf() {
    let doc = new jsPDF();
    let specialElementHandlers = {
      '#editor': function (element : any, renderer : any) {
        return true;
      }
    };

    let content = this.content.nativeElement;
    doc.fromHTML(content.innerHTML, 10, 10, {
      'width': 20,
      'elementHandlers': specialElementHandlers
    });

    doc.save('cost-summary-report.pdf');
  }
}
