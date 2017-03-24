/**
 * Created by techprimelab on 3/9/2017.
 */
import {  Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Http,Response} from "@angular/http";
import {LoaderService} from "../../../framework/shared/loader/loader.service";
import {academicdetails} from "./academic-details";
import {VALUE_CONSTANT} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-academic-details',
  templateUrl: 'academic-details.component.html',
  styleUrls: ['academic-details.component.css']
})

export class AcademicDetailComponent {
  userForm: FormGroup;

 private  error_msg: string;
 private  tempfield: string[];
 private schoolName:string;
 private universityName:string;
 private passingyear:string;
 private specialization:string;
  private year: any;
  private currentDate: any;
  private yearList = new Array();
 private selectedacademic= new academicdetails();
 private selectedacademicsdeatils:academicdetails[]=new Array();


  constructor(private _router: Router, private http: Http,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {
    this.tempfield = new Array(1);

    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);


  }

  createYearList(year: any) {
    for (let i = 0; i < VALUE_CONSTANT.MAX_ACADEMIC_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }
  }
  SChoolName(event:string){
    console.log(event);
this.selectedacademic.schoolName=event;

  }

  UniversityName(event:string){
    console.log(event);
    this.selectedacademic.universityName=event;

  };
  selectYearModel(newval: any){
    this.selectedacademic.passingyear=newval;
  }
  PassingYear(event:string){
    console.log(event);
    this.selectedacademic.passingyear=event;
  };

  Specializationfunc(event:string){
    console.log(event);
    this.selectedacademic.specialization=event;
  };




  addAnother() {
    this. selectedacademicsdeatils.push(this.selectedacademic);

    this.tempfield.push("null");

  }
}
