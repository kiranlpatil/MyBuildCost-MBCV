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
  templateUrl: 'academic-details.component.html'
})

export class AcademicDetailComponent {
  userForm: FormGroup;

  error_msg: string;
  tempfield: string[];
  schoolName:string;
  universityName:string;
  passingyear:string;
  specialization:string;

  private year: any;


  constructor(private _router: Router, private http: Http,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {
    this.tempfield = new Array(1);



  }
  SChoolName(event:string){
    console.log(event);

  }

  UniversityName(event:string){
    console.log(event);

  };
  PassingYear(event:string){
    console.log(event);
  };

  Specializationfunc(event:string){
    console.log(event);
  };




  addAnother() {

    this.tempfield.push("null");

  }
}
