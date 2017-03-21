/**
 * Created by techprimelab on 3/9/2017.
 */
import {  Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Http,Response} from "@angular/http";
import {LoaderService} from "../../../framework/shared/loader/loader.service";
import {split} from "ts-node/dist";

@Component({
  moduleId: module.id,
  selector: 'cn-more-about-myself',
  templateUrl: 'more-about-myself.component.html'
})

export class MoreAboutMyselfComponent {
  userForm: FormGroup;
  error_msg: string;
  tempfield: string[];
  status:string;
  newstring:string[];
k:number;

  private year: any;


  constructor(private _router: Router, private http: Http,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {
    this.tempfield = new Array(1);



  }


  // worcount(event:any){
  //
  //   console.log(this.status,event);
  // this.newstring=  this.status.split(" ");
  // this.k=this.newstring.length;
  //
  // }




  addAnother() {

    this.tempfield.push("null");

  }
}
