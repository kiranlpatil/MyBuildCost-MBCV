
import {  Component } from '@angular/core';
import {awards} from "../model/awards";

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



  constructor() {
    this.tempfield = new Array(1);



  }

  selectedAward(award:string){
    this.selectedaward.awardsdetails=award;


  }





  addAnother() {
    this.selectedawards.push(this.selectedaward);
    console.log(this.selectedawards);
    this.tempfield.push("null");

  }
}
