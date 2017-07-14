import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {ReleventIndustryListService} from "./relevent-industry-list.service";
import {LocalStorage, Messages} from "../../../framework/shared/constants";
import {Section} from "../model/candidate";
import {Observable} from "rxjs/Observable";
import {ReleventIndustry} from "./relevent-industry";
import {Role} from "../model/role";


@Component({
    moduleId:module.id,
    selector:'cn-relevent-industry-list',
    templateUrl:'relevent-industry-list.component.html',
    styleUrls:['relevent-industry-list.component.css']
})

export class ReleventIndustryListComponent implements OnInit {
  releventIndustries:ReleventIndustry[] = new Array();
  workAreas:string[] = new Array();
  workAreasToUpdate:string[] = new Array();
  @Output() onNextComplete = new EventEmitter();
  @Input() highlightedSection: Section;
  @Input() roles: Role[] = new Array(0);
  suggestionMsgForReleventIndustry:string;
  showRleventindustry:boolean=false;
  //arr = Observable.of(this.releventIndustries);
  constructor(private releventIndustryService:ReleventIndustryListService) {

  }

  ngOnInit() {
    /*this.arr.subscribe(data => {
      this.releventIndustries2 = data;
    });*/
    this.suggestionMsgForReleventIndustry = Messages.SUGGESTION_MSG_FOR_RELEVENT_INDUSTRY;
    this.getReleventIndustries();

  }

  ngOnChanges(changes:any) {
    if(changes.roles !== undefined && changes.roles.currentValue !== undefined){
      this.getReleventIndustries();
    }
  }

  getReleventIndustries() { debugger
    console.log('-------------------this.roles-------',this.roles);
    if(this.roles.length) {
      this.roles.forEach(x => this.workAreas.push(x.name));
      console.log('-------------------this.roles----arrrray---',this.workAreas);
      this.releventIndustryService.getReleventIndustries(this.workAreas)
        .subscribe(
          data => {
            this.onGetIndustriesSuccess(data);
          },
          error => {
            this.onError(error);
          });
    }
  }
  onGetIndustriesSuccess(data:any) {
    this.releventIndustries = data.industries;
    console.log('--------data-----',data);
  }
  onError(error:any) {
  console.log('----errorr------');
  }

  onNext() {
    this.highlightedSection.name = 'Compentancies';
    this.onNextComplete.emit();
  }

  getReleventIndustry(event:any) { debugger
    this.showRleventindustry = event.target.checked;
    //this.showRleventindustry = true;
  //if(event.target.checked) {
     this.releventIndustries.forEach(x => x.isChecked = event.target.checked);
    /* } else {
    this.releventIndustries.forEach(x => x.isChecked = event.target.checked);
    }*/
  }
  onValueChange(event:any,index:number) {
    this.releventIndustries[index].isChecked = event.target.checked;
  }

  updateSelectedReleventIndustries() {
    this.workAreasToUpdate = new Array(0);
    this.releventIndustries.forEach(item => {
      if(item.isChecked){
        this.workAreasToUpdate.push(item.name);
      }
    });
    if(this.workAreasToUpdate.length) {
      this.releventIndustryService.updateSelectedReleventIndustries(this.workAreasToUpdate)
        .subscribe(
          (data: any) => this.onUpdateSuccess(data),
          (error: any) => this.onUpdateError(error)
        )
    } else {

    }
  }
  onUpdateSuccess(data:any) {

  }
  onUpdateError(error:any) {

  }

}
