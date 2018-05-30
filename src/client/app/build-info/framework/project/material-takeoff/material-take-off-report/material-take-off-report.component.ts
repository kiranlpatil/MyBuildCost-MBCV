import { Component, Input, AfterViewInit } from '@angular/core';
import {MaterialTakeOffElements, Animations, SessionStorage} from '../../../../../shared/constants';
import {SessionStorageService} from '../../../../../shared/services/session.service';


@Component({
  moduleId: module.id,
  selector: 'bi-material-take-off-report',
  templateUrl: 'material-take-off-report.component.html',
  styleUrls: ['material-take-off-report.css']
})

export class MaterialTakeOffReportComponent implements AfterViewInit {

  animateView: boolean = false;
  @Input() materialTakeOffReport : any;
  @Input() buildingName : string;
  @Input() elementType : string;
  @Input() elementName : string;
  viewSubContent : boolean = false;
  viewNestedSubContent : boolean = false;
  headerIndex : number;
  dataIndex : number;
  nestedSubContentIndex : number;
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
    console.log('elementType->'+this.elementType);
    if(this.viewSubContent !== true || this.dataIndex !== secondaryViewDataIndex || this.headerIndex !== tableHeaderIndex) {
      this.dataIndex = secondaryViewDataIndex;
      this.headerIndex = tableHeaderIndex;
      this.viewSubContent = true;
    } else {
      this.viewSubContent = false;
    }
  }

  showInnerSubContent(innerSubContent : number) {
    if(this.viewNestedSubContent !== true || this.nestedSubContentIndex !== innerSubContent) {
      this.nestedSubContentIndex = innerSubContent;
      this.viewNestedSubContent = true;
    } else {
      this.viewNestedSubContent = false;
    }
  }

  getListItemAnimation(index : number) {
    return Animations.getListItemAnimationStyle(index, Animations.defaultDelayFactor);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('animated');
      this.animateView = true;
    },150);
  }
}
