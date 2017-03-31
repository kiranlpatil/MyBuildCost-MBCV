
import {  Component } from '@angular/core';
import {awards} from "../model/awards";
import {DateService} from "../date.service";
import {AwardService} from "../award-service";

@Component({
  moduleId: module.id,
  selector: 'cn-awards',
  templateUrl: 'awards.component.html',
  styleUrls: ['awards.component.css']
})

export class AwardsComponent {

  private tempfield: string[];
  private selectedaward=new awards();
  private selectedawards: awards[]=new Array();
  private monthList:string[]=this.dateservice.monthList;
  private yearList:string[]=this.dateservice.yearList;
  private disbleButton:boolean=false;



  constructor(private dateservice:DateService,private awardService:AwardService) {
    this.tempfield = new Array(1);



  }

  changeValue(){
    this.awardService.change(true);

  }
  selectedTitle(title:string)
  {
this.selectedaward.title=title;
  }
  selectedMonthModel(month:string)
  {
this.selectedaward.month=month;

  }
  selectedYearModel(year:string)
  {

this.selectedaward.year=year;
  }
  selectedAward(award:string){
    this.selectedaward.awardsdetails=award;


  }





  addAnother() {
    if(this.selectedaward.title==="" || this.selectedaward.month==="" ||
      this.selectedaward.year==="" || this.selectedaward.awardsdetails==="" )
    {

      this.disbleButton=true;
    }
    else {
      this.disbleButton = false;
      this.selectedawards.push(this.selectedaward);
    console.log(this.selectedawards);
    this.tempfield.push("null");}

  }
}
