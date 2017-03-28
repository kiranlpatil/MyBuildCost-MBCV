
import {  Component } from '@angular/core';
import {EmployementHistory} from "../model/employment-history";
import {VALUE_CONSTANT} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-Employment-History',
  templateUrl: 'employment-history.component.html',
  styleUrls: ['employment-history.component.css']
})

export class EmploymentHistoryComponent {

 private toMonthModel:string;
 private toYearModel:string;
 private fromMonthModel:string;
 private fromYearModel:string;
 private tempfield: string[];
 private selectedEmploymentHistory = new EmployementHistory();
 private selectedEmploysHistory :EmployementHistory[]=new Array();
 private year: any;
 private currentDate: any;
 private yearList = new Array();
 private monthList = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
 error_msg: string;

  constructor() {
    this.tempfield = new Array(1);

    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);

  }

  createYearList(year: any) {
    for (let i = 0; i < VALUE_CONSTANT.MAX_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }

  }

  comPanyName(companyname:string) {
    this.selectedEmploymentHistory.companyName=companyname;

  }

  deSignation(designation:string) {
    this.selectedEmploymentHistory.designation=designation;

  }

  reMark(remark:string){
    this.selectedEmploymentHistory.remarks=remark;
  }

  selectedworkfromMonthModel(newval: any){
    this.fromMonthModel=newval;
    this.selectedEmploymentHistory.workedFromMonth=newval;

  }

  selectedworkfromYearModel(newval: any){
    this.fromYearModel=newval;
    this.selectedEmploymentHistory.workedFromYear=newval;
}

  selectedworktoMonthModel(newval: any) {
    this.toMonthModel=newval;
    this.selectedEmploymentHistory.workedToMonth=newval;

  }

  selectedworktoYearModel(newval: any) {
    this.toYearModel=newval;
    this.selectedEmploymentHistory.workedToYear=newval;

  }



  addAnother() {
    this.selectedEmploysHistory.push(this.selectedEmploymentHistory);
    console.log(this.selectedEmploysHistory);
    this.tempfield.push("null");

  }
}
