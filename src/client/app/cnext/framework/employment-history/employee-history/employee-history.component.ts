import {Component,  Input} from "@angular/core";

import { FormGroup} from '@angular/forms';
import {ValueConstant} from "../../../../framework/shared/constants";


@Component({
  moduleId: module.id,
  selector: 'cn-employee-history',
  templateUrl: 'employee-history.component.html',
  styleUrls: ['employee-history.component.css']
})

export class EmployeeHistoryComponent {
  @Input('group')
  public employeeForm: FormGroup;
  private tempfield:string[];
  private year:any;
  private currentDate:any;
  private yearList = new Array();
  public monthList:string[] = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

  constructor() {
    this.tempfield = new Array(1);
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.year=this.year-ValueConstant.MAX_YEAR_LIST;
    this.createYearList(this.year); //TODO use the service for date list
  }

  createYearList(year:any) {

    for (let i = 0; i <= ValueConstant.MAX_YEAR_LIST; i++) {
      this.yearList.push(year++);
    }
  }

  setCurrentDate(){                        //TODO remove it.

    console.log("in set current date");
  }

}



