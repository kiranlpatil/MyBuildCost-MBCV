import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements, SessionStorage } from '../../../../../../shared/constants';
import { SessionStorageService } from '../../../../../../shared/services/session.service';


@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-wise-report',
  templateUrl: 'cost-head-wise-report.component.html',
  styleUrls: ['cost-head-wise-report.component.css'],
})

export class CostHeadWiseReportComponent  {

  @Input() costHeadWiseContent : any;
  @Input() secondaryViewDataIndex : number;
  @Input() rows: any;
  viewSubContent : boolean = false;
  viewNestedSubContent : boolean = false;
  headerIndex : number;
  dataIndex : number;
  nestedSubContentIndex : number;


  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  showInnerSubContent(innetSubContent : any, secondaryViewDataIndex : number, tableHeaderIndex : number,innerSubContent : number) {
    if(Object.keys(innetSubContent).length > 0) {
      if (this.viewSubContent !== true || this.dataIndex !== secondaryViewDataIndex || this.headerIndex !== tableHeaderIndex ||
        this.viewNestedSubContent !== true || this.nestedSubContentIndex !== innerSubContent) {
        this.dataIndex = secondaryViewDataIndex;
        this.headerIndex = tableHeaderIndex;
        this.viewSubContent = true;
        this.nestedSubContentIndex = innerSubContent;
        this.viewNestedSubContent = true;
      } else {
        this.viewSubContent = false;
        this.viewNestedSubContent = false;
      }
    } else {
      this.viewSubContent = false;
      this.viewNestedSubContent = false;
    }
  }
}

