
import {Component, Input} from '@angular/core';
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

   maxLength :number=250;
  tempfield: string[];
  aboutMyself:string;
  newstringOne:string[];
  newstringTwo:string[];
  newstringThree:string[];
  length:number;
  condition:number;
  remaining:number;
  maxword:number;
  model=new MoreAboutMyself();
  selectedMoreaboutMyself:MoreAboutMyself[]=new Array();


  constructor(private _router: Router, private http: Http,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {
    this.tempfield = new Array(1);



  }
  ngOnInit(){
    this.remaining=this.maxLength;
  }



  wordcount(event:any){

    console.log(this. aboutMyself,event);
  this.newstringOne= this. aboutMyself.split(" ");
    this.newstringTwo= this. aboutMyself.split(".");
    this.newstringThree= this. aboutMyself.split(",");
    this.condition=this.newstringOne.length+this.newstringTwo.length+this.newstringThree.length;
    this.remaining=this.maxLength-(this.condition-3);
    if (this.condition-3>=this.maxLength) {
      this. maxword=this.aboutMyself.length;
    }
  }




  addAnother() {

    this.tempfield.push("null");

  }
}
