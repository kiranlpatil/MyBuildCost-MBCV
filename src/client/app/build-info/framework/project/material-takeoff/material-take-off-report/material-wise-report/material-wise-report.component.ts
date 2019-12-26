import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements, SessionStorage } from '../../../../../../shared/constants';
import { SessionStorageService } from '../../../../../../shared/services/session.service';


@Component({
  moduleId: module.id,
  selector: 'bi-material-wise-report',
  templateUrl: 'material-wise-report.component.html',
  styleUrls: ['material-wise-report.component.css'],
})

export class MaterialWiseReportComponent  {

  @Input() materialWiseContent : any;
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

  showSubContent(secondaryViewDataIndex : number, tableHeaderIndex : number) {
    if(this.viewSubContent !== true || this.dataIndex !== secondaryViewDataIndex || this.headerIndex !== tableHeaderIndex) {
      this.dataIndex = secondaryViewDataIndex;
      this.headerIndex = tableHeaderIndex;
      this.viewSubContent = true;
    } else {
      this.viewSubContent = false;
    }
  }

  showInnerSubContent(innetSubContent : any,innerSubContent : number) {
    if(Object.keys(innetSubContent).length > 0) {
      if(this.viewNestedSubContent !== true || this.nestedSubContentIndex !== innerSubContent) {
        this.nestedSubContentIndex = innerSubContent;
        this.viewNestedSubContent = true;
      } else {
        this.viewNestedSubContent = false;
      }
    } else {
      this.viewNestedSubContent = false;
    }
  }
}

