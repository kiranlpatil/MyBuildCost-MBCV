/**
 * Created by techprimelab on 3/9/2017.
 */
import {  Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Http,Response} from "@angular/http";
import {LoaderService} from "../../../framework/shared/loader/loader.service";
import {certifications} from "../model/certification-accreditation";

@Component({
  moduleId: module.id,
  selector: 'cn-certification-accreditation',
  templateUrl: 'certification-accreditation.component.html',
  styleUrls: ['certification-accreditation.component.css']
})

export class CertificationAccreditationComponent {
  userForm: FormGroup;

  error_msg: string;
  tempfield: string[];
  certificate:string;
  selectedcertificate=new certifications();
  selectedcertificates:certifications[]=new Array();



  constructor(private _router: Router, private http: Http,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {
    this.tempfield = new Array(1);



  }
  deletecomponent(event:any){



  }

  certifications(event:any){
    console.log(event);
    this.selectedcertificate.certificationdetails=event;

  }





  addAnother() {
this.selectedcertificates.push(  this.selectedcertificate);
    console.log(this.selectedcertificates);
    this.tempfield.push("null");

  }
}
