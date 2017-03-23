import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';
import {Http} from "@angular/http";
import {LoaderService} from "../../../framework/shared/loader/loader.service";

@Component({
  moduleId: module.id,
  selector: 'cn-description-field',
  templateUrl: 'description-field.component.html',
  styleUrls: ['description-field.component.css']
})

export class DescriptionFieldComponent {
  @Input('type') type : string;
  @Input('maxLength') maxLength : string;

  status:string;
  newstringOne:string[];
  newstringTwo:string[];
  newstringThree:string[];
  condition:number;
  maxword:number;
  remaining:string;

  constructor(private _router: Router, private http: Http,
              private formBuilder: FormBuilder, private loaderService: LoaderService) {
    
  }

  ngOnInit(){
    this.remaining=this.maxLength;
  }

  wordcount(event:any){
    this.newstringOne= this.status.split(" ");
    this.newstringTwo= this.status.split(".");
    this.newstringThree= this.status.split(",");
    this.condition=this.newstringOne.length+this.newstringTwo.length+this.newstringThree.length;
    this.remaining=this.maxLength-(this.condition-3);
      if (this.condition-3>=this.maxLength) {
        this. maxword=this.status.length;
      }
  }
}
