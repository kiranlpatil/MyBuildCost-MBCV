
import {   Component  } from '@angular/core';
import {  Awards  } from '../model/awards';
import { AwardService } from '../award-service';
import { ValueConstant } from '../../../framework/shared/constants';

@Component({
  moduleId: module.id,
  selector: 'cn-awards',
  templateUrl: 'awards.component.html',
  styleUrls: ['awards.component.css']
})

export class AwardsComponent {
  public monthList = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  private tempfield: string[];
  private temptitle:string='';
  private tempmonth:string='';
  private tempyear:string='';
  private tempremark:string='';
  private selectedawards: Awards[]=new Array();
  private disbleButton:boolean=false;
  private year: any;
  private currentDate: any;
  private yearList = new Array();

  constructor( private awardService:AwardService ) {
    this.tempfield = new Array(1);
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);
  }
  createYearList(year: number) {
    for (let i = 0; i < ValueConstant.MAX_ACADEMIC_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }
  }
  changeValue() {
    this.awardService.change(true);
  }
  selectedTitle(title:string) {
    this.temptitle=title;
  }
  selectedMonthModel(month:string) {
    this.tempmonth=month;
  }
  selectedYearModel(year:string) {
    this.tempyear=year;
  }
  selectedAward(award:string) {
    this.tempremark=award;
  }
  addAnother() {
    if (this.temptitle!=='' && this.tempmonth!=='' &&
      this.tempyear!=='' && this.tempremark!=='') {
      let temp=new Awards();
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
    } else {
      this.disbleButton = true;
    }
  }
}
