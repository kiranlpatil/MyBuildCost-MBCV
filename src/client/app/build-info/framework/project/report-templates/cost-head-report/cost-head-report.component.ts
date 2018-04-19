import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CostSummaryService } from '../../cost-summary-report/cost-summary.service';
import { SessionStorage, SessionStorageService } from '../../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-report-pdf',
  templateUrl: 'cost-head-report.component.html'
})

export class CostHeadReportComponent implements OnInit, AfterViewInit  {

  @ViewChild('content', {read: ElementRef}) content: ElementRef;
  @Input() costHeadId: number;

  costHead : any;
  projectName : string;
  buildingName : string;
  comapnyName : string;
  generatedDate: Date = new Date();

  constructor(private costSummaryService : CostSummaryService) {
    console.log('constructor');
  }

  ngAfterViewInit(): void {
    console.log(this.content.nativeElement.innerHTML);
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
    this.projectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
    this.buildingName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING_NAME);
    this.comapnyName = SessionStorageService.getSessionValue(SessionStorage.COMPANY_NAME);
  }

  onGetCategoriesFailure(error : Error) {
    console.log('categoryDetails error : '+JSON.stringify(error));
  }

  downloadToPDF() {
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
}
