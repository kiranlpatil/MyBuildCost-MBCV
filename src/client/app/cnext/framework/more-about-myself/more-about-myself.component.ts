
import {  Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';
import {Http} from "@angular/http";
import {LoaderService} from "../../../framework/shared/loader/loader.service";
import {MoreAboutMyself} from "./more-about-myself";

@Component({
  moduleId: module.id,
  selector: 'cn-more-about-myself',
  templateUrl: 'more-about-myself.component.html',
  styleUrls: ['more-about-myself.component.css']
})

export class MoreAboutMyselfComponent {
  tempfield: string[];
  aboutMyself:string;
  newstringOne:string[];
  newstringTwo:string[];
  newstringThree:string[];
  length:number;
  condition:number;
  remaining:number=250;
  maxword:number;
  model=new MoreAboutMyself();
  selectedMoreaboutMyself:MoreAboutMyself[]=new Array();


  constructor(private _router: Router, private http: Http,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {
    this.tempfield = new Array(1);



  }


  wordcount(event:any){

    console.log(this. aboutMyself,event);
  this.newstringOne= this. aboutMyself.split(" ");
    this.newstringTwo= this. aboutMyself.split(".");
    this.newstringThree= this. aboutMyself.split(",");

  this.condition=this.newstringOne.length;
  this.condition+=this.newstringTwo.length;
  this.condition+=this.newstringThree.length;
  this.remaining=250-this.condition;
  console.log(this.condition);
  if (this.condition-3>=250)
  {this. maxword=this. aboutMyself.length;
    this.length=this. maxword;

  }
  }




  addAnother() {

    this.tempfield.push("null");

  }
}
