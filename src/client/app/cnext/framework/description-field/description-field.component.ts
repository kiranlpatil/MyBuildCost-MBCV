import { Component, Input, OnInit } from '@angular/core';
import { JonPostDescriptionService } from '../job-post-description.service';
import { Description } from '../model/description';


@Component({
  moduleId: module.id,
  selector: 'cn-description-field',
  templateUrl: 'description-field.component.html',
  styleUrls: ['description-field.component.css']
})

export class DescriptionFieldComponent implements OnInit {
  @Input('type') type : string;
  @Input('maxLength') maxLength :number;

 private description:string;
 private newstringOne:string[];
 private newstringTwo:string[];
 private newstringThree:string[];
 private condition:number;
 private maxword:number;
 private tempType:string;
 private tempdetail:string;
 private model=new Description();
 private remainingWords:number;
  constructor(private jobPostDescription:JonPostDescriptionService) {

  }

  ngOnInit() {
    this.remainingWords=this.maxLength;
  }

  wordCount(event:any) {
    this.newstringOne= this.description.split(' ');
    this.newstringTwo= this.description.split('.');
    this.newstringThree= this.description.split(',');
    this.condition=this.newstringOne.length+this.newstringTwo.length+this.newstringThree.length;
    this.remainingWords=this.maxLength-(this.condition-3);
      if (this.condition-3>=this.maxLength) {
        this. maxword=this.description.length;
      }
         this.tempType=this.type;
         this.tempdetail = event;
        this.model.detail =  this.tempdetail;
        this.model.selectedType = this.tempType;
        this.jobPostDescription.change(this.model);
  }
}
