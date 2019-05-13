import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SessionStorageService } from '../../../../../shared/services/session.service';
import { Label, SessionStorage} from '../../../../../shared/constants';
import { ProjectElements } from '../../../../../shared/constants';
import { SharedService } from '../../../../../shared/services/shared-service';

@Component({
  moduleId: module.id,
  selector: 'cost-summary-report-pdf',
  templateUrl: 'cost-summary-report.component.html',
  styleUrls: ['cost-summary-report.component.css'],
})

export class CostSummaryReportComponent {
  @ViewChild('budgetedAndEstimated', {read: ElementRef}) budgetedAndEstimated: ElementRef;
  @ViewChild('budgeted', {read: ElementRef}) budgeted: ElementRef;
  @ViewChild('estimated', {read: ElementRef}) estimated: ElementRef;
  @Input() buildingReport: any;
  @Input() costingByUnit: any;
  @Input() costingByArea: any;
  currentProjectName: string;
  company_name: string;
  generatedDate: Date = new Date();

  constructor(private sharedService: SharedService) {
    this.company_name = SessionStorageService.getSessionValue(SessionStorage.COMPANY_NAME);
    this.currentProjectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
  }

  downloadToPdf(reportType: string) {
    let content: any;
    switch (reportType) {
      case 'Budgeted and Estimated cost report':
        content = this.budgetedAndEstimated.nativeElement.innerHTML;
        break;
      case 'Budgeted cost report':
        content = this.budgeted.nativeElement.innerHTML;
        break;
      case 'Estimated cost report':
        content = this.estimated.nativeElement.innerHTML;
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

