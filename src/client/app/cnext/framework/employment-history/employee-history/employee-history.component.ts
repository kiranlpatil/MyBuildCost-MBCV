import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValueConstant, Messages } from '../../../../framework/shared/constants';


@Component({
  moduleId: module.id,
  selector: 'cn-employee-history',
  templateUrl: 'employee-history.component.html',
  styleUrls: ['employee-history.component.css']
})

export class EmployeeHistoryComponent {
  @Input('group')
  public employeeForm: FormGroup;

  @Input() submitStatus: boolean;
  private year: any;
  private currentDate: any;
  private yearList = new Array();
  public monthList: string[] = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
private fromYear:number;
private toYear:number;
private requiredCompanyNameValidationMessage = Messages.MSG_ERROR_VALIDATION_COMPANYNAME_REQUIRED;
private requiredDesignationValidationMessage = Messages.MSG_ERROR_VALIDATION_DESIGNATION_REQUIRED;

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

  setCurrentDate() {                        //TODO remove it.
  }

onFromYear(value:any) {
    this.fromYear=value;
}
onToYear(value:any) {
  this.toYear=value;
}
}



