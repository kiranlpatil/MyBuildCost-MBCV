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
  templateUrl: 'more-about-myself.component.html',
  styleUrls: ['more-about-myself.component.css']
})

export class MoreAboutMyselfComponent {
  userForm: FormGroup;
  error_msg: string;
  tempfield: string[];
  status:string;
  newstringOne:string[];
  newstringTwo:string[];
  newstringThree:string[];
  length:number;
  condition:number;
  maxword:number;

  private year: any;


  constructor(private _router: Router, private http: Http,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {
    this.tempfield = new Array(1);



  }


  wordcount(event:any){

    console.log(this.status,event);
  this.newstringOne= this.status.split(" ");
    this.newstringTwo= this.status.split(".");
    this.newstringThree= this.status.split(",");

  this.condition=this.newstringOne.length;
  this.condition+=this.newstringTwo.length;
  this.condition+=this.newstringThree.length;
  console.log(this.condition);
  if (this.condition-3>=250)
  {this. maxword=this.status.length;
    this.length=this. maxword;

  }
  }




  addAnother() {

    this.tempfield.push("null");

  }
}
