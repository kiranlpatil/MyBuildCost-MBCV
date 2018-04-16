import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as jsPDF from 'jspdf';
import { CostSummaryService } from '../../cost-summary-report/cost-summary.service';
import { SessionStorage, SessionStorageService } from '../../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-report-pdf',
  templateUrl: 'cost-head-report.component.html'
})

export class CostHeadReportComponent implements OnInit {

  @ViewChild('content') content: ElementRef;
  @Input() costHeadId: number;

  costHead : any;

  constructor(private costSummaryService : CostSummaryService) {
    console.log('constructor');
  }

  ngOnInit() {
    console.log('costHeadId : '+this.costHeadId);
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    let url = 'project/'+projectId+'/building/'+buildingId;
    this.costSummaryService.getCostHeadDetails(url, this.costHeadId).subscribe(
      categoryDetails => this.onGetCategoriesSuccess(categoryDetails),
      error => this.onGetCategoriesFailure(error)
    );
  }

  onGetCategoriesSuccess(costHeadDetails : any) {
    this.costHead = costHeadDetails.data;
  }

  onGetCategoriesFailure(error : Error) {
    console.log('categoryDetails error : '+JSON.stringify(error));
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

    doc.save('cost-head-report.pdf');
  }
}
