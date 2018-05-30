import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SessionStorage, SessionStorageService } from '../../../../../shared/index';
import { ProjectElements } from '../../../../../shared/constants';
import { WorkItem } from '../../../model/work-item';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-report-pdf',
  templateUrl: 'cost-head-report.component.html'
})

export class CostHeadReportComponent implements OnInit  {

  @ViewChild('content', {read: ElementRef}) content: ElementRef;
  @Input() categoryDetails: any;
  @Input() categoryDetailsTotalAmount: any;
  @Input() viewType: string;

  costHead : any;
  projectName : string;
  buildingName : string;
  comapnyName : string;
  costHeadName : string;
  generatedDate: Date = new Date();

  ngOnInit() {

    this.projectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
    this.buildingName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING_NAME);
    this.comapnyName = SessionStorageService.getSessionValue(SessionStorage.COMPANY_NAME);
    this.costHeadName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_NAME);
  }

  downloadToPDF() {
    console.log('categoryDetails -> '+JSON.stringify(this.categoryDetails));
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

  isWorkItemsActive(workItems : Array<WorkItem>) {
    let countOfActiveWorkItems = 0;
    for(let workItem of workItems) {
      if(workItem.active) {
        countOfActiveWorkItems++;
        break;
      }
    }

    if(countOfActiveWorkItems > 0) {
      return true;
    } else {
      return false;
    }
  }

  isCategoryHavingWorkItem(categoryDetails : any) {

    let count = 0;
    for(let category of categoryDetails) {
      if(this.isWorkItemsActive(category.workItems)) {
        count++;
        break;
      }
    }

    if(count > 0) {
      return true;
    } else {
      return false;
    }
  }
}
