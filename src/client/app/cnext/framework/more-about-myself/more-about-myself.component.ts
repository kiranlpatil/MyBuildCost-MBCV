
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

  private  maxLength :number=250;
  private  reSize: string[];
  private aboutMyself:string;
  private newstringOne:string[];
  private newstringTwo:string[];
  private newstringThree:string[];
  private wordsTillNow:number;
  private remainingWords:number;
  private maxword:number;



  constructor() {
    this.reSize = new Array(1);



  }
  ngOnInit(){
    this.remainingWords=this.maxLength;
  }



  wordCount(event:any){
   this.newstringOne= this. aboutMyself.split(" ");
    this.newstringTwo= this. aboutMyself.split(".");
    this.newstringThree= this. aboutMyself.split(",");
    this.wordsTillNow=this.newstringOne.length+this.newstringTwo.length+this.newstringThree.length;
    this.remainingWords=this.maxLength-(this.wordsTillNow-3);
    if (this.wordsTillNow-3>=this.maxLength) {
      this. maxword=this.aboutMyself.length;
    }
  }




  addAnother() {

    this.reSize.push("null");

  }
}
