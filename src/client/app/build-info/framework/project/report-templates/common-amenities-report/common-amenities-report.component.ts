import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {Label, SessionStorage} from '../../../../../shared/constants';
import { SessionStorageService } from '../../../../../shared/services/session.service';
import { ProjectElements } from '../../../../../shared/constants';
import { SharedService } from '../../../../../shared/services/shared-service';

@Component({
  moduleId: module.id,
  selector: 'common-amenities-report-pdf',
  templateUrl: 'common-amenities-report.component.html',
  styleUrls: ['common-amenities-report.component.css']
})

export class CommonAmenitiesReportComponent {

  @ViewChild('amenitiesBothReport') amenitiesBothReport: ElementRef;
  @ViewChild('amenitiesBudgetedReport') amenitiesBudgetedReport: ElementRef;
  @ViewChild('amenitiesEstimatedReport') amenitiesEstimatedReport: ElementRef;
  @Input() amenitiesReport: any;
  @Input() costingByUnit: any;
  @Input() costingByArea: any;
  @Input() grandTotalOfArea: number;

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
    let content:any;
    switch (reportType) {
      case 'budgetedAndEstimatedCostReport':
        content = this.amenitiesBothReport.nativeElement.innerHTML;
        break;
      case 'budgetedCostreport':
        content = this.amenitiesBudgetedReport.nativeElement.innerHTML;break;
      case 'estimatedCostReport':
        content = this.amenitiesEstimatedReport.nativeElement.innerHTML;
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
