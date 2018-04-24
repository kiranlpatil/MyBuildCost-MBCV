import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SessionStorage } from '../../../../../shared/constants';
import { SessionStorageService } from '../../../../../shared/services/session.service';
import { ProjectElements } from '../../../../../shared/constants';

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
    let contentDiv = document.createElement('div');
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

  getProjectElements() {
    return ProjectElements;
  }
}
