
import {   Component  } from '@angular/core';
import { EmployementHistory } from '../model/employment-history';
import { ValueConstant } from '../../../framework/shared/constants';

@Component({
  moduleId: module.id,
  selector: 'cn-employment-history',
  templateUrl: 'employment-history.component.html',
  styleUrls: ['employment-history.component.css']
})

export class EmploymentHistoryComponent {
  public monthList:string[]= new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  error_msg: string;
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
    this.selectedEmploymentHistory.from.month=this.tempWorkedFromMonth;

  }

  selectedworkfromYearModel(newval: any) {
    this.tempWorkedFromYear=newval;
    this.selectedEmploymentHistory.from.year=this.tempWorkedFromYear;
  }

  selectedworktoMonthModel(newval: any) {
    this.tempWorkedToMonth=newval;
    this.selectedEmploymentHistory.to.month=this.tempWorkedToMonth;

  }

  selectedworktoYearModel(newval: any) {
       this.tempWorkedToYear=newval;
       this.selectedEmploymentHistory.to.year=this.tempWorkedToYear;
  }
  addAnother() {
    if(this.tempCompanyName==='' || this.tempDesignation==='' ||
      this.tempWorkedToMonth==='' || this.tempWorkedToYear==='' ||
      this.tempWorkedFromMonth===''||this.tempWorkedFromYear===''||
      this.tempRemarks==='' ) {
      this.disbleButton=true;
    } else {
      if(this.tempWorkedToYear<this.selectedEmploymentHistory.from.year||
        (this.selectedEmploymentHistory.from.month===this.selectedEmploymentHistory.to.month
        &&
        (this.tempWorkedToYear===this.selectedEmploymentHistory.from.year))||this.tempWorkedToYear===this.selectedEmploymentHistory.from.year&&
        (this.monthList.indexOf(this.tempWorkedToMonth)<this.monthList.indexOf(this.tempWorkedFromMonth) )) {
        this.isShowYearMessage=true;
        this.toYearModel='';

    } else {
        this.disbleButton = false;
        this.isShowYearMessage=false;
        let temp = new EmployementHistory();
        temp.companyName = this.tempCompanyName;
        temp.designation = this.tempDesignation;
        temp.remarks = this.tempRemarks;
        temp.from.month = this.tempWorkedFromMonth;
        temp.from.year = this.tempWorkedFromYear;
        temp.to.month= this.tempWorkedToMonth;
        temp.to.year = this.tempWorkedToYear;
        this.selectedEmploysHistory.push(temp);
        console.log(this.selectedEmploysHistory);
        this.tempfield.push('null');
        this.tempCompanyName = '';
        this.tempDesignation = '';
        this.tempWorkedToMonth = '';
        this.tempWorkedToYear = '';
        this.tempWorkedFromMonth = '';
        this.tempWorkedFromYear = '';
        this.tempRemarks = '';
      }
    }

  }}

