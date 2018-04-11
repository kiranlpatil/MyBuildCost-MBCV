import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as jsPDF from 'jspdf';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-report-pdf',
  templateUrl: 'cost-head-report.component.html'
})

export class CostHeadReportComponent implements OnInit {

  @ViewChild('content') content: ElementRef;

  items : Array<string> = ['abc' , 'def'];
  constructor() {
    console.log('constru');
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  downloadToPdf() {
    let doc = new jsPDF();
    let specialElementHandlers = {
      '#editor': function (element : any, renderer : any) {
        return true;
      }
    };

    let content = this.content.nativeElement;
    doc.fromHTML(content.innerHTML, 15, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save('test.pdf');
  }
}
