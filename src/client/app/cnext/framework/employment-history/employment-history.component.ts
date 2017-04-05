
import {   Component  } from '@angular/core';
import { EmployementHistory } from '../model/employment-history';
import { ValueConstant } from '../../../framework/shared/constants';
import { EducationalService } from '../educational-service';

@Component({
  moduleId: module.id,
  selector: 'cn-Employment-History',
  templateUrl: 'employment-history.component.html',
  styleUrls: ['employment-history.component.css']
})

export class EmploymentHistoryComponent {

 private tempCompanyName:string='';
 private toYearModel:string;
 private isShowYearMessage:boolean=false;
 private tempDesignation:string='';
 private tempWorkedToMonth:string='';
  private tempWorkedToYear:string='';
  private tempWorkedFromMonth:string='';
  private tempWorkedFromYear:string='';
  private tempRemarks:string='';
 private disbleButton:boolean=false;
 private tempfield: string[];
 private selectedEmploymentHistory = new EmployementHistory();
 private selectedEmploysHistory :EmployementHistory[]=new Array();
 private year: any;
 private currentDate: any;
 private yearList = new Array();
 private monthList = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
 error_msg: string;

  constructor() {
    this.tempfield = new Array(1);

    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);

  }

  createYearList(year: any) {
    for (let i = 0; i < ValueConstant.MAX_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }

  }

  comPanyName(companyname:string) {
    this.tempCompanyName=companyname;
    this.selectedEmploymentHistory.companyName=this.tempCompanyName;

  }

  deSignation(designation:string) {
    this.tempDesignation=designation;
    this.selectedEmploymentHistory.designation=this.tempDesignation;

  }



  reMark(remark:string) {
    this.tempRemarks=remark;
    this.selectedEmploymentHistory.remarks=this.tempRemarks;


  }

  selectedworkfromMonthModel(newval: any) {
    this.tempWorkedFromMonth=newval;
    this.selectedEmploymentHistory.workedFromMonth=this.tempWorkedFromMonth;

  }

  selectedworkfromYearModel(newval: any) {
    this.tempWorkedFromYear=newval;
    this.selectedEmploymentHistory.workedFromYear=this.tempWorkedFromYear;
}

  selectedworktoMonthModel(newval: any) {
    this.tempWorkedToMonth=newval;
    this.selectedEmploymentHistory.workedToMonth=this.tempWorkedToMonth;

  }

  selectedworktoYearModel(newval: any) {

    if(newval<this.selectedEmploymentHistory.workedFromYear||
      (this.selectedEmploymentHistory.workedFromMonth===this.selectedEmploymentHistory.workedToMonth &&
      newval===this.selectedEmploymentHistory.workedFromYear))
    {
      this.isShowYearMessage=true;
      this.toYearModel='';
    }
    else {
      this.isShowYearMessage=false;
      this.tempWorkedToYear=newval;

    }

  }




  addAnother() {debugger

    if(this.tempCompanyName==='' || this.tempDesignation==='' ||
      this.tempWorkedToMonth==='' || this.tempWorkedToYear==='' ||
      this.tempWorkedFromMonth==='' || this.tempWorkedFromYear==='' ||
      this.tempRemarks==='' )
    {

      this.disbleButton=true;
    }
    else {
      this.disbleButton = false;

     let temp= new EmployementHistory();
     temp.companyName=this.tempCompanyName;
     temp.designation=this.tempDesignation;
     temp.remarks=this.tempRemarks;
     temp.workedFromMonth=this.tempWorkedFromMonth;
     temp.workedFromYear=this.tempWorkedFromYear;
     temp.workedToMonth=this.tempWorkedFromMonth;
     temp.workedToYear=this.tempRemarks;

      this.selectedEmploysHistory.push(temp);
      console.log(this.selectedEmploysHistory);
      this.tempfield.push('null');}
    this.tempCompanyName='';
   this.tempDesignation='' ;
    this.tempWorkedToMonth='';
    this.tempWorkedToYear='';
    this.tempWorkedFromMonth='';
    this.tempWorkedFromYear='' ;
    this.tempRemarks='';


  }
}
