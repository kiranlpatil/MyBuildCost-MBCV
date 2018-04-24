import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as jsPDF from 'jspdf';
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
@ViewChild('content') content: ElementRef;
@Input() amenitiesReport: any;
@Input() costingByUnit: any;
@Input() costingByArea: any;
  isBudgeted: boolean = false;
  isEstimated: boolean = false;
  generatedDate: Date = new Date();
  costReportFor: string;
  currentProjectName: string;
  company_name: string;

  constructor() {
    this.company_name = SessionStorageService.getSessionValue(SessionStorage.COMPANY_NAME);
    this.currentProjectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
  }

  downloadToPdf(reportType: string) {
    switch (reportType) {
      case 'Budgeted and Estimated cost report':
        this.isBudgeted = true;
        this.isEstimated = true;
        this.costReportFor = 'Budgeted & Estimated';
        break;
      case 'Budgeted cost report':
        this.isBudgeted = true;
        this.isEstimated = false;
        this.costReportFor = 'Budgeted';
        break;
      case 'Estimated cost report':
        this.isEstimated = true;
        this.isBudgeted = false;
        this.costReportFor = 'Estimated';
        break;
      default:
        this.isBudgeted = false;
        this.isEstimated = false;
    }
    setTimeout(()=> {
      this.print();
    }, 100);
  }

  print() {
    let contentDiv = document.createElement('div');
    let content = this.content.nativeElement.innerHTML;
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
