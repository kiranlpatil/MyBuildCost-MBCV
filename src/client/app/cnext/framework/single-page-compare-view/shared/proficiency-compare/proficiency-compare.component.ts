import {Component,Input } from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'cn-proficiency-compare',
  templateUrl: 'proficiency-compare.component.html',
  styleUrls: ['proficiency-compare.component.css']
})

export class ProficiencyCompareComponent {
  @Input() data:any;
  @Input() matchdData:any=new Array(0);

  checkData(item:any){
    if(this.matchdData !== undefined ){
    if(this.matchdData.indexOf(item)>=0){
      return true;
    } else{
      return false;
    }
  }
    else {
      return false;
    }
  } 
}
