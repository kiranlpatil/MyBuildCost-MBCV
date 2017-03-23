/**
 * Created by techprimelab on 3/9/2017.
 */
import {  Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Http,Response} from "@angular/http";
import {LoaderService} from "../../../framework/shared/loader/loader.service";
import {academicdetails} from "./academic-details";

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
 private selectedacademic= new academicdetails();
 private selectedacademicsdeatils:academicdetails[]=new Array();

  private year: any;


  constructor(private _router: Router, private http: Http,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {
    this.tempfield = new Array(1);



  }
  SChoolName(event:string){
    console.log(event);
this.selectedacademic.schoolName=event;

  }

  UniversityName(event:string){
    console.log(event);
    this.selectedacademic.universityName=event;

  };
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
