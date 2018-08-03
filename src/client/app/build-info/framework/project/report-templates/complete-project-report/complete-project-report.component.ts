import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SessionStorage } from '../../../../../shared/constants';
import { SessionStorageService } from '../../../../../shared/services/session.service';
import { ProjectElements } from '../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'complete-project-report-pdf',
  templateUrl: 'complete-project-report.component.html',
  styleUrls: ['complete-project-report.component.css']
})

export class CompleteProjectReportComponent {
  @ViewChild('projectBothReport', {read: ElementRef}) projectBothReport: ElementRef;
  @ViewChild('projectBudgetedReport') projectBudgetedReport: ElementRef;
  @ViewChild('projectEstimatedReport', {read: ElementRef}) projectEstimatedReport: ElementRef;
  @ViewChild('bothReport') bothReport: ElementRef;
  @ViewChild('budgetedReport') budgetedReport: ElementRef;
  @ViewChild('estimatedReport') estimatedReport: ElementRef;
  @Input() amenitiesReport: any;
  @Input() buildingReports: any;
  @Input() costingByUnit: any;
  @Input() costingByArea: any;

  isBudgeted: boolean = false;
  isEstimated: boolean = false;
  generatedDate: Date = new Date();
  currentProjectName: string;
  company_name: string;

  constructor() {
    this.company_name = SessionStorageService.getSessionValue(SessionStorage.COMPANY_NAME);
    this.currentProjectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
  }

  downloadToPdf(reportType: string) {
    //setTimeout(function() {
      let content: any;
      switch (reportType) {
        case 'budgetedAndEstimatedCostReport':
          content = this.projectBothReport.nativeElement.innerHTML+this.bothReport.nativeElement.innerHTML ;
          break;
        case 'budgetedCostreport':
          content = this.projectBudgetedReport.nativeElement.innerHTML +this.budgetedReport.nativeElement.innerHTML;
          break;
        case 'estimatedCostReport':
          content =  this.projectEstimatedReport.nativeElement.innerHTML+this.estimatedReport.nativeElement.innerHTML ;
          break;
      }
      let contentDiv = document.createElement('div');
      contentDiv.innerHTML = content;
      contentDiv.setAttribute('id', 'print-div');
      document.getElementById('tpl-app').style.display = 'none';
      window.document.body.appendChild(contentDiv);
      window.document.close();
      window.print();
      var elem = document.querySelector('#print-div');
      elem.parentNode.removeChild(elem);
      document.getElementById('tpl-app').style.display = 'initial';
   // },2000);
  }

  getProjectElements() {
    return ProjectElements;
  }
}
