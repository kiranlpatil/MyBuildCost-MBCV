import { Component, Input } from '@angular/core';
import {MaterialTakeOffElements, SessionStorage} from '../../../../../shared/constants';
import {SessionStorageService} from '../../../../../shared/services/session.service';


@Component({
  moduleId: module.id,
  selector: 'bi-material-take-off-report',
  templateUrl: 'material-take-off-report.component.html',
  styleUrls: ['material-take-off-report.css'],
})

export class MaterialTakeOffReportComponent  {

  @Input() materialTakeOffReport : any;
  @Input() buildingName : string;
  @Input() elementType : string;
  @Input() elementName : string;
  viewSubContent : boolean = false;
  headerIndex : number;
  dataIndex : number;
  projectName : string;
  companyName : string;

  constructor() {
    /*this.projectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
    this.companyName = SessionStorageService.getSessionValue(SessionStorage.COMPANY_NAME);*/
  }

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  showSubContent(secondaryViewDataIndex : number, tableHeaderIndex : number) {
    if(this.viewSubContent !== true || this.dataIndex !== secondaryViewDataIndex || this.headerIndex !== tableHeaderIndex) {
      this.dataIndex = secondaryViewDataIndex;
      this.headerIndex = tableHeaderIndex;
      this.viewSubContent = true;
    } else {
      this.viewSubContent = false;
    }
  }
}
