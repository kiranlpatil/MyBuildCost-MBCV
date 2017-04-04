
import {   Component  } from '@angular/core';
import {  awards  } from '../model/awards';
import {  DateService  } from '../date.service';
import {  AwardService  } from '../award-service';

@Component({
  moduleId: module.id,
  selector: 'cn-awards',
  templateUrl: 'awards.component.html',
  styleUrls: ['awards.component.css']
})

export class AwardsComponent {

  private tempfield: string[];
  private temptitle:string='';
  private tempmonth:string='';
  private tempyear:string='';
  private tempremark:string='';
  private selectedawards: awards[]=new Array();
  private monthList:string[]=this.dateservice.monthList;
  private yearList:string[]=this.dateservice.yearList;
  private disbleButton:boolean=false;




  constructor(private dateservice:DateService,private awardService:AwardService) {
    this.tempfield = new Array(1);



  }

  changeValue() {
    this.awardService.change(true);

  }
  selectedTitle(title:string)
  {

this.temptitle=title;
  }
  selectedMonthModel(month:string)

  {
    this.tempmonth=month;

  }
  selectedYearModel(year:string)
  {

this.tempyear=year;
  }

  selectedAward(award:string) {
this.tempremark=award;


  }





  addAnother() {


    if (this.temptitle!='' && this.tempmonth!='' &&
      this.tempyear!='' && this.tempremark!='') {
      let temp=new awards();
      temp.title=this.temptitle;
      temp.month=this.tempmonth;
      temp.year=this.tempyear;
      temp.awardsdetails=this.tempremark;
      this.selectedawards.push(temp);
      console.log(this.selectedawards);
      this.disbleButton = false;
      this.tempfield.push('null');
      this.temptitle='' ;
      this.tempmonth ='' ;
      this.tempremark ='' ;this.tempyear='';
    }
    else {

      this.disbleButton = true;


    }



  }
}
