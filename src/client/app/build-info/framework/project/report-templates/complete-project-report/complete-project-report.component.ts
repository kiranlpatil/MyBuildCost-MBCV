import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {Label, SessionStorage} from '../../../../../shared/constants';
import { SessionStorageService } from '../../../../../shared/services/session.service';
import { ProjectElements } from '../../../../../shared/constants';
import { SharedService } from '../../../../../shared/services/shared-service';

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
  @Input() grandTotalOfTotalRate: any;
  @Input() grandTotalOfBudgetedCost: any;
  @Input() grandTotalOfEstimatedRate: any;
  @Input() grandTotalOfEstimatedCost: any;
  @Input() grandTotalOfBasicEstimatedCost: any;
  @Input() grandTotalOfGstComponent: any;
  @Input() grandTotalOfRateWithoutGst: any;


  isBudgeted: boolean = false;
  isEstimated: boolean = false;
  generatedDate: Date = new Date();
  currentProjectName: string;
  company_name: string;

  constructor(private sharedService: SharedService) {
    this.company_name = SessionStorageService.getSessionValue(SessionStorage.COMPANY_NAME);
    this.currentProjectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
  }

  downloadToPdf(reportType: string) {
    let content: any;
    switch (reportType) {
      case 'budgetedAndEstimatedCostReport':
        content = this.projectBothReport.nativeElement.innerHTML + this.bothReport.nativeElement.innerHTML;
        break;
      case 'budgetedCostreport':
        content = this.projectBudgetedReport.nativeElement.innerHTML + this.budgetedReport.nativeElement.innerHTML;
        break;
      case 'estimatedCostReport':
        content = this.projectEstimatedReport.nativeElement.innerHTML + this.estimatedReport.nativeElement.innerHTML;
        break;
    }
    this.sharedService.downloadToPdf(content);

  }

  getProjectElements() {
    return ProjectElements;
  }

  getLabel() {
    return Label;
  }
}
