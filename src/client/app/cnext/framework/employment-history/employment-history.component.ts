/**
 * Created by techprimelab on 3/9/2017.
 */
import {  Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Http,Response} from "@angular/http";
import {LoaderService} from "../../../framework/shared/loader/loader.service";
import {EmployementHistory} from "./employment-history";
import {EmploymentHistoryService} from "./employment-history.service";
import {VALUE_CONSTANT} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-EmploymentHistory',
  templateUrl: 'employment-history.component.html',
  styleUrls: ['employment-history.component.css']
})

export class EmploymentHistoryComponent {
  userForm: FormGroup;
  company:string;
  design:string;
  toMonthModel:string;
  toYearModel:string;
  fromMonthModel:string;
  fromYearModel:string;
  error_msg: string;
  tempfield: string[];
  remark:string;
  private selectedEmploymentHistory = new EmployementHistory();

  private year: any;
  private currentDate: any;
  private yearList = new Array();
  private monthList = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");


  constructor(private _router: Router, private http: Http, private employmenthistoryService: EmploymentHistoryService,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {
    this.tempfield = new Array(1);

    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);

  }

  createYearList(year: any) {
    for (let i = 0; i < VALUE_CONSTANT.MAX_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }
    // console.log("list of year", this.yearList);
    // console.log("list of year", this.monthList);
  }
  comPanyName(newval:string) {
    console.log(newval);
    this.selectedEmploymentHistory.companyname=newval;
    console.log(this.selectedEmploymentHistory.companyname,"123456789");


  }
  deSignation(newval:string) {

    console.log(newval);
    this.selectedEmploymentHistory.designation=newval;

  }
  reMark(newval:string){
    console.log(newval);
    this.selectedEmploymentHistory.remarks=newval;



  }


  selectworkfromMonthModel(newval: any){
    this.fromMonthModel=newval;
this.selectedEmploymentHistory.workedFromMonth=newval;

  }
  selectworkfromYearModel(newval: any){
    this.fromYearModel=newval;
 this.selectedEmploymentHistory.workedFromYear=newval;
}

  selectworktoMonthModel(newval: any) {
    this.toMonthModel=newval;
this.selectedEmploymentHistory.workedToMonth=newval;

  }

  selectworktoYearModel(newval: any) {
this.toYearModel=newval;
this.selectedEmploymentHistory.workedToYear=newval;
  }


  addAnother() {

    this.tempfield.push("null");

  }
}
