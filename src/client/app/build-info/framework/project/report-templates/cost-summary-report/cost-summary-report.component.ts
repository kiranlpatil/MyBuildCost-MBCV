import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SessionStorageService } from '../../../../../shared/services/session.service';
import { SessionStorage } from '../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'cost-summary-report-pdf',
  templateUrl: 'cost-summary-report.component.html',
})

export class CostSummaryReportComponent {
  @ViewChild('budgetedAndEstimated', {read: ElementRef}) budgetedAndEstimated: ElementRef;
  @ViewChild('budgeted', {read: ElementRef}) budgeted: ElementRef;
  @ViewChild('estimated', {read: ElementRef}) estimated: ElementRef;
  @Input() buildingReport: any;
  @Input() costingByUnit: any;
  @Input() costingByArea: any;
  currentProjectName: string;
  isBudgetedAndEstimated: boolean = false;
  isBudgeted: boolean = false;
  isEstimated: boolean = false;

  constructor() {
    this.currentProjectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
  }

  downloadToPdf(reportType: string) {
    let content: any;
    switch (reportType) {
      case 'Budgeted and Estimated cost report':
        content = this.budgetedAndEstimated.nativeElement.innerHTML;
        this.isBudgetedAndEstimated = true;
        break;
      case 'Budgeted cost report':
        content = this.budgeted.nativeElement.innerHTML;
        this.isBudgeted = true;
        break;
      case 'Estimated cost report':
        content = this.estimated.nativeElement.innerHTML;
        this.isEstimated = true;
        break;
      default:
        this.isBudgetedAndEstimated = false;
        this.isBudgeted = false;
        this.isEstimated = false;
    }
    let contentDiv = document.createElement('div');
    //let content = this.BudgetedAndEstimated.nativeElement.innerHTML;
    contentDiv.innerHTML = content;
    contentDiv.setAttribute('id','print-div');
    document.getElementById('tpl-app').style.display = 'none';
    window.document.body.appendChild(contentDiv);
    window.document.close();
    window.print();
    var elem = document.querySelector('#print-div');
    elem.parentNode.removeChild(elem);
    document.getElementById('tpl-app').style.display = 'initial';
  }
}

