import { Component, Input } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { ValueConstant } from '../../../../framework/shared/constants';


@Component({
  moduleId: module.id,
  selector: 'cn-academics',
  templateUrl: 'academics.component.html',
  styleUrls: ['academics.component.css']
})

export class AcademicsComponent {
  @Input('group')
  public academicForm: FormGroup;
  private year: any;
  private currentDate: any;
  private yearList = new Array();

  constructor() {
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.year = this.year - ValueConstant.MAX_YEAR_LIST;
    this.createYearList(this.year); //TODO use the service for date list

  }

  createYearList(year: any) {
    for (let i = 0; i <= ValueConstant.MAX_YEAR_LIST; i++) {
      this.yearList.push(year++);
    }
  }
}



