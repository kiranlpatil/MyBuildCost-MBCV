import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Messages, ValueConstant, LocalStorage} from '../../../../shared/constants';


@Component({
  moduleId: module.id,
  selector: 'cn-employee-history',
  templateUrl: 'employee-history.component.html',
  styleUrls: ['employee-history.component.css']
})

export class EmployeeHistoryComponent implements OnInit{
  @Input('group')
  public employeeForm: FormGroup;

  @Input() submitStatus: boolean;

  private year: any;
  isDisableToDate: boolean;
  private currentDate: any;
  yearList = new Array();
  public monthList: string[] = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  fromYear: number;
  toYear: number;
  private requiredCompanyNameValidationMessage = Messages.MSG_ERROR_VALIDATION_COMPANYNAME_REQUIRED;
  private requiredDesignationValidationMessage = Messages.MSG_ERROR_VALIDATION_DESIGNATION_REQUIRED;

  constructor() {
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.year = this.year - ValueConstant.MAX_YEAR_LIST;
    this.createYearList(this.year); //TODO use the service for date list
  }

  ngOnInit() {
    
  }

  ngOnChanges(changes: any) {
    if (changes.employeeForm.currentValue != undefined &&
      changes.employeeForm.currentValue.controls.isPresentlyWorking._value === true) {
      this.isDisableToDate = true;
    }
  }
  createYearList(year: any) {

    for (let i = 0; i <= ValueConstant.MAX_YEAR_LIST; i++) {
      this.yearList.unshift(year++);
    }
  }

  onFromYear(value: any) {
    this.fromYear = value;
  }

  onToYear(value: any) {
    this.toYear = value;
  }

  onCheckClick(value: any) {
    this.employeeForm.controls["to"].reset();
    this.isDisableToDate = value;
  }


}

