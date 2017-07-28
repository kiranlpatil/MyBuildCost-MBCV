import {Component, Input, OnChanges, Output} from "@angular/core";
import {ProfileComparisonService} from "./profile-comparison.service";
import {ProfileComparison, ProfileComparisonData} from "../model/profile-comparison";
import {EventEmitter} from "@angular/common/src/facade/async";

@Component({
  moduleId:module.id,
  selector:'cn-profile-comparison',
  templateUrl:'profile-comparison.component.html',
    styleUrls: ['profile-comparison.component.css']
})

export class ProfileComparisonComponent implements OnChanges {

  @Input() profileComparison:ProfileComparison;
  @Output() performActionOnComparisonList = new EventEmitter();
  private profileComparisonData: ProfileComparisonData[] = new Array(0);

  constructor(private profileComparisonService:ProfileComparisonService) {

  }


  ngOnChanges(changes: any) {
    if (changes.profileComparison.currentValue != undefined) {
      this.profileComparisonData = changes.profileComparison.currentValue.profileComparisonData;
    }
  }

  actionOnComparisonList(value:any) {
    this.performActionOnComparisonList.emit(value);
    /*if(data.action = 'Remove') {
     this.profileComparisonData.splice(data.value,1);
     }*/
  }

}
